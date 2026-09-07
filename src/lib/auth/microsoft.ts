import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { isValidEmail, normalizeEmail } from "@/lib/validation";
import { MICROSOFT_ENTRA_PROVIDER_ID } from "@/lib/auth/constants";

const PLACEHOLDER_VALUES = new Set([
  "tu_application_client_id",
  "tu_client_secret",
  "your-client-id",
  "your-client-secret",
  "changeme",
  "xxx",
  "<application (client) id>",
  "<client secret value>",
]);

export type MicrosoftEntraConfig = {
  clientId: string;
  clientSecret: string;
  issuer: string;
  allowedDomains: string[];
};

type EntraProfileLike = {
  email?: string | null;
  preferred_username?: string | null;
  upn?: string | null;
  oid?: string | null;
  name?: string | null;
  picture?: string | null;
};

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function isUsableSecret(value: string): boolean {
  if (!value) return false;
  if (PLACEHOLDER_VALUES.has(value.toLowerCase())) return false;
  return !/^(tu_|your_|example|<)/i.test(value);
}

/**
 * Acepta issuer completo (`https://login.microsoftonline.com/{tenant}/v2.0`)
 * o solo el tenant (`guid`, `common`, `organizations`).
 */
export function resolveMicrosoftIssuer(raw?: string): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;

  if (/^https?:\/\//i.test(value)) {
    return value.replace(/\/+$/, "");
  }

  return `https://login.microsoftonline.com/${value}/v2.0`;
}

function parseAllowedDomains(raw: string): string[] {
  return raw
    .split(/[,\s]+/)
    .map((part) => part.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean);
}

export function getMicrosoftEntraConfig(): MicrosoftEntraConfig | null {
  const clientId = readEnv("AUTH_MICROSOFT_ENTRA_ID_ID");
  const clientSecret = readEnv("AUTH_MICROSOFT_ENTRA_ID_SECRET");
  const issuer = resolveMicrosoftIssuer(
    readEnv("AUTH_MICROSOFT_ENTRA_ID_ISSUER") || readEnv("AUTH_MICROSOFT_ENTRA_ID_TENANT_ID"),
  );
  const allowedDomains = parseAllowedDomains(readEnv("AUTH_MICROSOFT_ALLOWED_DOMAIN"));

  if (!isUsableSecret(clientId) || !isUsableSecret(clientSecret) || !issuer) {
    return null;
  }

  return { clientId, clientSecret, issuer, allowedDomains };
}

/** Server-only. No importar en Client Components: las env no son NEXT_PUBLIC. */
export function isMicrosoftEntraConfigured(): boolean {
  return getMicrosoftEntraConfig() !== null;
}

export function isAllowedMicrosoftEmail(email: string, allowedDomains?: string[]): boolean {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) return false;

  const domains = allowedDomains ?? getMicrosoftEntraConfig()?.allowedDomains ?? [];
  if (domains.length === 0) return true;

  const host = normalized.split("@")[1] ?? "";
  return domains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

export function resolveMicrosoftEmail(
  userEmail?: string | null,
  profile?: EntraProfileLike | null,
): string {
  const candidates = [
    userEmail,
    profile?.email,
    profile?.preferred_username,
    profile?.upn,
  ];

  for (const value of candidates) {
    const email = normalizeEmail(String(value ?? ""));
    if (isValidEmail(email)) return email;
  }

  return "";
}

export function resolveMicrosoftOid(
  account?: { providerAccountId?: string } | null,
  profile?: EntraProfileLike | null,
): string {
  return String(profile?.oid ?? account?.providerAccountId ?? "").trim();
}

export function createMicrosoftEntraProvider() {
  const config = getMicrosoftEntraConfig();
  if (!config) return null;

  return MicrosoftEntraID({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    issuer: config.issuer,
    authorization: {
      params: {
        scope: "openid profile email User.Read",
      },
    },
  });
}

export { MICROSOFT_ENTRA_PROVIDER_ID };
