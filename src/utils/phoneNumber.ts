/**
 * Normalizes a phone number to E.164 format
 * Assumes US numbers if no country code provided
 */
export function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Handle different formats
  if (digits.length === 10) {
    // US number without country code: 2345678900 → +12345678900
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits[0] === '1') {
    // US number with country code: 12345678900 → +12345678900
    return `+${digits}`;
  }

  if (digits.length > 11) {
    // Already has country code
    return `+${digits}`;
  }

  // Return with + prefix
  return `+${digits}`;
}

/**
 * Formats a phone number for display
 * +12345678900 → (234) 567-8900
 */
export function formatPhoneNumber(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  const digits = normalized.replace(/\D/g, '');

  // Format US numbers
  if (digits.length === 11 && digits[0] === '1') {
    const areaCode = digits.slice(1, 4);
    const prefix = digits.slice(4, 7);
    const lineNumber = digits.slice(7, 11);
    return `(${areaCode}) ${prefix}-${lineNumber}`;
  }

  return phone; // Return original if not US format
}

/**
 * Validates a phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  const digits = normalized.replace(/\D/g, '');

  // Check if it's a valid length (10-15 digits is standard)
  return digits.length >= 10 && digits.length <= 15;
}