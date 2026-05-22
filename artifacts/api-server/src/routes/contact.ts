import { Router, type IRouter, type Request } from "express";
import { logger } from "../lib/logger";

type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
  website: string;
};

type ContactValidationResult =
  | { ok: true; payload: ContactPayload }
  | { ok: false; message: string };

type BrevoConfig = {
  apiKey: string;
  apiUrl: string;
  fromEmail: string;
  fromName: string;
  toEmail: string;
  toName?: string;
};

type BrevoConfigResult =
  | { ok: true; config: BrevoConfig }
  | { ok: false; missing: string[] };

const router: IRouter = Router();
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const rateLimitWindowMs = 15 * 60 * 1000;
const rawRateLimitMax = Number(process.env["CONTACT_RATE_LIMIT_MAX"] ?? "5");
const rateLimitMax =
  Number.isFinite(rawRateLimitMax) && rawRateLimitMax > 0 ? rawRateLimitMax : 5;

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

router.post("/contact", async (req, res) => {
  const validation = validateContactPayload(req.body);

  if (!validation.ok) {
    res.status(400).json({ message: validation.message });
    return;
  }

  if (validation.payload.website) {
    res.status(202).json({ ok: true });
    return;
  }

  if (isRateLimited(getRateLimitKey(req))) {
    res.status(429).json({
      message: "Wysłano zbyt wiele wiadomości. Spróbuj ponownie za kilka minut.",
    });
    return;
  }

  const brevoConfig = getBrevoConfig();

  if (!brevoConfig.ok) {
    logger.error(
      { missingEnv: brevoConfig.missing },
      "Contact form Brevo configuration is missing",
    );
    res.status(503).json({
      message: "Formularz kontaktowy nie jest jeszcze skonfigurowany.",
    });
    return;
  }

  try {
    await sendBrevoContactEmail(brevoConfig.config, validation.payload);
    res.status(202).json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Contact form Brevo delivery failed");
    res.status(502).json({
      message: "Nie udało się wysłać wiadomości. Spróbuj ponownie później.",
    });
  }
});

function validateContactPayload(body: unknown): ContactValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Nieprawidłowe dane formularza." };
  }

  const record = body as Record<string, unknown>;
  const payload: ContactPayload = {
    name: getString(record["name"]),
    phone: getString(record["phone"]),
    email: getString(record["email"]),
    message: getString(record["message"]),
    website: getString(record["website"]),
  };

  if (payload.name.length < 2 || payload.name.length > 120) {
    return { ok: false, message: "Podaj imię i nazwisko." };
  }

  if (!emailPattern.test(payload.email) || payload.email.length > 254) {
    return { ok: false, message: "Podaj prawidłowy adres e-mail." };
  }

  if (!/^[+0-9\s().-]{7,30}$/.test(payload.phone)) {
    return { ok: false, message: "Podaj prawidłowy numer telefonu." };
  }

  if (payload.message.length < 10 || payload.message.length > 4000) {
    return {
      ok: false,
      message: "Wiadomość musi mieć od 10 do 4000 znaków.",
    };
  }

  return { ok: true, payload };
}

function getBrevoConfig(): BrevoConfigResult {
  const missing: string[] = [];
  const apiKey = getRequiredEnv("BREVO_API_KEY", missing);
  const from = getRequiredEnv("CONTACT_FROM", missing);
  const to = getRequiredEnv("CONTACT_TO", missing);

  if (missing.length > 0) {
    return { ok: false, missing };
  }

  const fromAddress = parseAddress(from);
  const toAddress = parseAddress(to);

  return {
    ok: true,
    config: {
      apiKey,
      apiUrl:
        process.env["BREVO_API_URL"]?.trim() ||
        "https://api.brevo.com/v3/smtp/email",
      fromEmail: fromAddress.email,
      fromName: fromAddress.name || "Formularz Jany Dzialki",
      toEmail: toAddress.email,
      toName: toAddress.name,
    },
  };
}

async function sendBrevoContactEmail(
  config: BrevoConfig,
  payload: ContactPayload,
): Promise<void> {
  const message = createContactMessage(payload);
  const response = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      "api-key": config.apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: config.fromEmail,
        name: config.fromName,
      },
      to: [
        {
          email: config.toEmail,
          ...(config.toName ? { name: config.toName } : {}),
        },
      ],
      replyTo: {
        email: payload.email,
        name: payload.name,
      },
      subject: `Nowe zapytanie z formularza - ${payload.name}`,
      textContent: message.text,
      htmlContent: message.html,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Brevo API failed with HTTP ${response.status}: ${await truncateResponse(response)}`,
    );
  }
}

function createContactMessage(payload: ContactPayload): { text: string; html: string } {
  const sentAt = new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Warsaw",
  }).format(new Date());

  const fields: Array<[string, string]> = [
    ["Wysłano", sentAt],
    ["Imię i nazwisko", payload.name],
    ["Telefon", payload.phone],
    ["E-mail", payload.email],
  ];

  return {
    text: [
      "Nowe zapytanie z formularza kontaktowego",
      "",
      ...fields.map(([label, value]) => `${label}: ${value}`),
      "",
      "Wiadomość:",
      payload.message,
    ].join("\n"),
    html: [
      "<h2>Nowe zapytanie z formularza kontaktowego</h2>",
      "<dl>",
      ...fields.map(
        ([label, value]) =>
          `<dt><strong>${escapeHtml(label)}</strong></dt><dd>${escapeHtml(value)}</dd>`,
      ),
      "</dl>",
      "<p><strong>Wiadomość:</strong></p>",
      `<p>${escapeHtml(payload.message).replace(/\n/g, "<br>")}</p>`,
    ].join(""),
  };
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getRequiredEnv(name: string, missing: string[]): string {
  const value = process.env[name]?.trim();

  if (!value) {
    missing.push(name);
    return "";
  }

  return value;
}

function getRateLimitKey(req: Request): string {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    cleanupRateLimitBuckets(now);
    return false;
  }

  bucket.count += 1;
  return bucket.count > rateLimitMax;
}

function cleanupRateLimitBuckets(now: number): void {
  for (const [key, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key);
    }
  }
}

function parseAddress(value: string): { email: string; name?: string } {
  const match = value.match(/^\s*(?:"?([^"<]*)"?\s*)?<([^>]+)>\s*$/);

  if (match) {
    const name = match[1]?.trim();

    return {
      email: match[2].trim(),
      ...(name ? { name } : {}),
    };
  }

  return { email: value.trim() };
}

async function truncateResponse(response: Response): Promise<string> {
  const text = await response.text();
  return text.length > 500 ? `${text.slice(0, 500)}...` : text;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default router;
