import { Router, type IRouter, type Request } from "express";
import { logger } from "../lib/logger";
import { extractEmailAddress, sendMail, type MailMessage, type SmtpConfig } from "../lib/smtp";

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

type SmtpConfigResult =
  | { ok: true; config: SmtpConfig }
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

  const smtpConfig = getSmtpConfig();

  if (!smtpConfig.ok) {
    logger.error(
      { missingEnv: smtpConfig.missing },
      "Contact form SMTP configuration is missing",
    );
    res.status(503).json({
      message: "Formularz kontaktowy nie jest jeszcze skonfigurowany.",
    });
    return;
  }

  try {
    await sendMail(smtpConfig.config, createContactMail(smtpConfig.config, validation.payload));
    res.status(202).json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Contact form email delivery failed");
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

function getSmtpConfig(): SmtpConfigResult {
  const missing: string[] = [];
  const host = getRequiredEnv("SMTP_HOST", missing);
  const rawPort = getRequiredEnv("SMTP_PORT", missing);
  const user = getRequiredEnv("SMTP_USER", missing);
  const pass = getRequiredEnv("SMTP_PASS", missing);
  const to = getRequiredEnv("CONTACT_TO", missing);

  if (missing.length > 0) {
    return { ok: false, missing };
  }

  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    return { ok: false, missing: ["SMTP_PORT"] };
  }

  const secure = parseBooleanEnv("SMTP_SECURE") ?? port === 465;
  const requireTls = parseBooleanEnv("SMTP_REQUIRE_TLS") ?? !secure;
  const timeoutMs = Number(process.env["SMTP_TIMEOUT_MS"] ?? "10000");
  const from = process.env["CONTACT_FROM"]?.trim() || user;

  return {
    ok: true,
    config: {
      host,
      port,
      secure,
      requireTls,
      user,
      pass,
      from,
      to,
      timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 10000,
    },
  };
}

function createContactMail(config: SmtpConfig, payload: ContactPayload): MailMessage {
  const sentAt = new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Warsaw",
  }).format(new Date());

  return {
    fromName: "Formularz Jany Działki",
    fromEmail: extractEmailAddress(config.from),
    replyToName: payload.name,
    replyToEmail: payload.email,
    to: config.to,
    subject: `Nowe zapytanie z formularza - ${payload.name}`,
    text: [
      "Nowe zapytanie z formularza kontaktowego",
      "",
      `Wysłano: ${sentAt}`,
      `Imię i nazwisko: ${payload.name}`,
      `Telefon: ${payload.phone}`,
      `E-mail: ${payload.email}`,
      "",
      "Wiadomość:",
      payload.message,
    ].join("\n"),
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

function parseBooleanEnv(name: string): boolean | undefined {
  const value = process.env[name]?.trim().toLowerCase();

  if (!value) {
    return undefined;
  }

  return ["1", "true", "yes", "tak"].includes(value);
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

export default router;
