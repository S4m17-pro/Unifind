export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function truncate(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export function isDataUrlImage(value: string): boolean {
  return value.startsWith("data:image/") && value.includes(";base64,");
}
