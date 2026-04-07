/**
 * Generate a unique idempotency key for API requests.
 * Uses crypto.randomUUID() for cryptographically secure UUIDs.
 */
export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}
