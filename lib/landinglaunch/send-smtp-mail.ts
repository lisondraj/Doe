import { randomUUID } from "crypto";
import tls from "tls";

/**
 * Minimal SMTP sender (implicit TLS, AUTH LOGIN) so launch signup alerts need no email service or extra package.
 * Built for a Gmail / Google Workspace mailbox with an app password. Server-only.
 */

const SMTP_TIMEOUT_MS = 10_000;

export type SmtpConfig = { host: string; port: number; user: string; pass: string };

/** Reads SMTP_USER and SMTP_PASS (a Gmail app password; spaces are ignored). Returns null when not configured. */
export function getSmtpConfig(): SmtpConfig | null {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  if (!user || !pass || user.startsWith("your-") || pass.startsWith("your-")) return null;
  const port = Number(process.env.SMTP_PORT) || 465;
  return { host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com", port, user, pass };
}

function b64(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

class SmtpSession {
  private buffer = "";
  private error: Error | null = null;
  private wake: (() => void) | null = null;

  constructor(private readonly socket: tls.TLSSocket) {
    socket.setEncoding("utf8");
    socket.on("data", (chunk: string) => {
      this.buffer += chunk;
      this.wake?.();
    });
    socket.on("error", (error: Error) => {
      this.error = error;
      this.wake?.();
    });
    socket.on("close", () => {
      this.error ??= new Error("SMTP connection closed.");
      this.wake?.();
    });
  }

  /** Waits for a full (possibly multi-line) server reply and checks its status code. */
  async reply(expected: number): Promise<void> {
    for (;;) {
      const lines = this.buffer.split("\r\n");
      const index = lines.findIndex((line, i) => i < lines.length - 1 && /^\d{3} /.test(line));
      if (index >= 0) {
        const line = lines[index] ?? "";
        this.buffer = lines.slice(index + 1).join("\r\n");
        if (Number(line.slice(0, 3)) !== expected) throw new Error(`SMTP error: ${line}`);
        return;
      }
      if (this.error) throw this.error;
      await new Promise<void>((resolve) => {
        this.wake = resolve;
      });
      this.wake = null;
    }
  }

  async command(line: string, expected: number): Promise<void> {
    this.socket.write(`${line}\r\n`);
    await this.reply(expected);
  }

  write(data: string): void {
    this.socket.write(data);
  }
}

/** Sends a plain-text email from the authenticated mailbox. Throws on any failure. */
export async function sendSmtpMail(
  config: SmtpConfig,
  message: { to: string; subject: string; text: string },
): Promise<void> {
  const socket = tls.connect({ host: config.host, port: config.port, servername: config.host });
  socket.setTimeout(SMTP_TIMEOUT_MS, () => socket.destroy(new Error("SMTP timed out.")));
  const session = new SmtpSession(socket);

  try {
    await new Promise<void>((resolve, reject) => {
      socket.once("secureConnect", () => resolve());
      socket.once("error", reject);
    });

    const domain = config.user.split("@")[1] ?? "localhost";
    const body = (b64(message.text).match(/.{1,76}/g) ?? []).join("\r\n");
    const raw = [
      `From: Doe <${config.user}>`,
      `To: <${message.to}>`,
      `Subject: =?UTF-8?B?${b64(message.subject)}?=`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${randomUUID()}@${domain}>`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: base64",
      "",
      body,
    ].join("\r\n");

    await session.reply(220);
    await session.command(`EHLO ${domain}`, 250);
    await session.command("AUTH LOGIN", 334);
    await session.command(b64(config.user), 334);
    await session.command(b64(config.pass), 235);
    await session.command(`MAIL FROM:<${config.user}>`, 250);
    await session.command(`RCPT TO:<${message.to}>`, 250);
    await session.command("DATA", 354);
    session.write(`${raw}\r\n.\r\n`);
    await session.reply(250);
    await session.command("QUIT", 221).catch(() => undefined);
  } finally {
    socket.destroy();
  }
}
