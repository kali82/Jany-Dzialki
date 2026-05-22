import { randomUUID } from "node:crypto";
import net from "node:net";
import tls from "node:tls";

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  requireTls: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
  timeoutMs: number;
};

export type MailMessage = {
  fromName: string;
  fromEmail: string;
  replyToName: string;
  replyToEmail: string;
  to: string;
  subject: string;
  text: string;
};

type SmtpResponse = {
  code: number;
  lines: string[];
};

class SmtpConnection {
  private socket: net.Socket | tls.TLSSocket;
  private buffer = "";
  private pendingRead:
    | {
        resolve: (response: SmtpResponse) => void;
        reject: (error: Error) => void;
      }
    | undefined;

  constructor(socket: net.Socket | tls.TLSSocket) {
    this.socket = socket;
    this.bindSocket(socket);
  }

  async upgradeToTls(host: string, timeoutMs: number): Promise<void> {
    this.socket.removeAllListeners("data");
    this.buffer = "";

    const tlsSocket = tls.connect({
      socket: this.socket,
      servername: host,
      timeout: timeoutMs,
    });

    this.socket = tlsSocket;
    this.bindSocket(tlsSocket);
    await waitForSocket(tlsSocket, "secureConnect");
  }

  async readResponse(): Promise<SmtpResponse> {
    const existing = this.extractResponse();
    if (existing) {
      return existing;
    }

    return new Promise<SmtpResponse>((resolve, reject) => {
      this.pendingRead = { resolve, reject };
    });
  }

  async send(command: string, expectedCodes: number[]): Promise<SmtpResponse> {
    this.socket.write(`${command}\r\n`);
    const response = await this.readResponse();

    if (!expectedCodes.includes(response.code)) {
      throw new Error(`SMTP command failed (${response.lines.join(" | ")})`);
    }

    return response;
  }

  async sendData(message: string): Promise<void> {
    const dotStuffed = message
      .replace(/\r?\n/g, "\r\n")
      .split("\r\n")
      .map((line) => (line.startsWith(".") ? `.${line}` : line))
      .join("\r\n");

    this.socket.write(`${dotStuffed}\r\n.\r\n`);
    const response = await this.readResponse();

    if (response.code !== 250) {
      throw new Error(`SMTP DATA failed (${response.lines.join(" | ")})`);
    }
  }

  async quit(): Promise<void> {
    try {
      await this.send("QUIT", [221]);
    } finally {
      this.socket.end();
    }
  }

  destroy(): void {
    this.socket.destroy();
  }

  private bindSocket(socket: net.Socket | tls.TLSSocket): void {
    socket.setEncoding("utf8");
    socket.on("data", (chunk: Buffer | string) => {
      this.buffer += typeof chunk === "string" ? chunk : chunk.toString("utf8");
      this.flushPendingRead();
    });
    socket.on("error", (error) => {
      this.pendingRead?.reject(error);
      this.pendingRead = undefined;
    });
    socket.on("timeout", () => {
      socket.destroy(new Error("SMTP connection timeout"));
    });
    socket.on("close", () => {
      this.pendingRead?.reject(new Error("SMTP connection closed"));
      this.pendingRead = undefined;
    });
  }

  private flushPendingRead(): void {
    if (!this.pendingRead) {
      return;
    }

    const response = this.extractResponse();

    if (!response) {
      return;
    }

    const pending = this.pendingRead;
    this.pendingRead = undefined;
    pending.resolve(response);
  }

  private extractResponse(): SmtpResponse | undefined {
    let position = 0;
    const lines: string[] = [];

    while (position < this.buffer.length) {
      const lineEnd = this.buffer.indexOf("\n", position);

      if (lineEnd === -1) {
        return undefined;
      }

      const rawLine = this.buffer.slice(position, lineEnd).replace(/\r$/, "");
      position = lineEnd + 1;

      if (!/^\d{3}[ -]/.test(rawLine)) {
        continue;
      }

      lines.push(rawLine);

      if (rawLine[3] === " ") {
        this.buffer = this.buffer.slice(position);
        return {
          code: Number(rawLine.slice(0, 3)),
          lines,
        };
      }
    }

    return undefined;
  }
}

export async function sendMail(config: SmtpConfig, message: MailMessage): Promise<void> {
  const socket = config.secure
    ? tls.connect({
        host: config.host,
        port: config.port,
        servername: config.host,
        timeout: config.timeoutMs,
      })
    : net.connect({
        host: config.host,
        port: config.port,
        timeout: config.timeoutMs,
      });

  const connection = new SmtpConnection(socket);

  try {
    await waitForSocket(socket, config.secure ? "secureConnect" : "connect");
    await connection.readResponse();
    await connection.send(`EHLO ${getEhloHost()}`, [250]);

    if (!config.secure && config.requireTls) {
      await connection.send("STARTTLS", [220]);
      await connection.upgradeToTls(config.host, config.timeoutMs);
      await connection.send(`EHLO ${getEhloHost()}`, [250]);
    }

    await connection.send(
      `AUTH PLAIN ${Buffer.from(`\0${config.user}\0${config.pass}`, "utf8").toString("base64")}`,
      [235],
    );
    await connection.send(`MAIL FROM:<${extractEmailAddress(config.from)}>`, [250]);
    await connection.send(`RCPT TO:<${extractEmailAddress(config.to)}>`, [250, 251]);
    await connection.send("DATA", [354]);
    await connection.sendData(formatMessage(message));
    await connection.quit();
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

export function extractEmailAddress(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] ?? value).trim();
}

function waitForSocket(
  socket: net.Socket | tls.TLSSocket,
  event: "connect" | "secureConnect",
): Promise<void> {
  return new Promise((resolve, reject) => {
    const onReady = () => {
      socket.off("error", onError);
      resolve();
    };
    const onError = (error: Error) => {
      socket.off(event, onReady);
      reject(error);
    };

    socket.once(event, onReady);
    socket.once("error", onError);
  });
}

function formatMessage(message: MailMessage): string {
  const headers = [
    `From: ${formatAddress(message.fromEmail, message.fromName)}`,
    `To: ${formatAddress(message.to)}`,
    `Reply-To: ${formatAddress(message.replyToEmail, message.replyToName)}`,
    `Subject: ${encodeHeader(message.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${randomUUID()}@jany-dzialki.local>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
  ];

  return `${headers.join("\r\n")}\r\n\r\n${toBase64Lines(message.text)}`;
}

function formatAddress(email: string, name?: string): string {
  if (!name) {
    return `<${extractEmailAddress(email)}>`;
  }

  return `${encodeHeader(name)} <${extractEmailAddress(email)}>`;
}

function encodeHeader(value: string): string {
  const sanitized = value.replace(/[\r\n]+/g, " ").trim();

  if (/^[\x20-\x7e]*$/.test(sanitized)) {
    return sanitized;
  }

  return `=?UTF-8?B?${Buffer.from(sanitized, "utf8").toString("base64")}?=`;
}

function toBase64Lines(value: string): string {
  const encoded = Buffer.from(value, "utf8").toString("base64");
  const lines: string[] = [];

  for (let index = 0; index < encoded.length; index += 76) {
    lines.push(encoded.slice(index, index + 76));
  }

  return lines.join("\r\n");
}

function getEhloHost(): string {
  return process.env["SMTP_EHLO_HOST"]?.trim() || "localhost";
}
