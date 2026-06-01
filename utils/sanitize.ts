export function sanitize(value: string): string {
  return value.replace(/[\x00-\x1F\x7F<>"'`]/g, "").trim();
}

export function sanitizeEmail(value: string): string {
  return sanitize(value).toLowerCase();
}
