// ===========================================
// EZRA PORTAL - Validation Utilities
// ===========================================

/**
 * Validates an email address format.
 *
 * Rules (consistent with backend validation in api/serializers.py):
 * - Must contain exactly one '@'
 * - Local part (before @) must be non-empty and contain no whitespace
 * - Domain part (after @) must be non-empty, contain no whitespace, and have at least one dot
 * - Domain parts separated by dots must all be non-empty
 *
 * Backend regex equivalent: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 */
export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;

  // Use the same regex pattern as the backend: ^[^\s@]+@[^\s@]+\.[^\s@]+$
  // This ensures: no whitespace, exactly one @, non-empty local part,
  // domain with at least one dot, and non-empty domain parts
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}
