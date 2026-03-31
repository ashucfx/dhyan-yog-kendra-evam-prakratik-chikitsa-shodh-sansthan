export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const indianMobileRegex = /^(?:\+91)?[6-9]\d{9}$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,12}$/;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function validateEmail(value: string) {
  return emailRegex.test(normalizeEmail(value));
}

export function normalizeIndianMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
}

export function validateIndianMobile(value: string) {
  return indianMobileRegex.test(normalizeIndianMobile(value));
}

export function validatePassword(value: string) {
  return passwordRegex.test(value);
}

export function getPasswordRequirementMessage() {
  return "Password must be 8 to 12 characters with uppercase, lowercase, number, and special character.";
}
