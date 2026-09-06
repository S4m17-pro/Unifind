import { Resend } from "resend";

let client: Resend | null | undefined;

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || apiKey.startsWith("re_123456789")) {
    return null;
  }

  if (!client) {
    client = new Resend(apiKey);
  }

  return client;
}
