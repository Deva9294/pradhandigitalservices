const INDIAN_MOBILE = /^[6-9]\d{9}$/;

export function normalizeIndianMobile(input: string): string {
  return input.replace(/\D/g, "").replace(/^91/, "").slice(-10);
}

export function isValidIndianMobile(input: string): boolean {
  return INDIAN_MOBILE.test(normalizeIndianMobile(input));
}

export function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}

export type ContactFormFields = {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
};

export function validateContactForm(
  fields: ContactFormFields,
  options?: { emailRequired?: boolean; subjectRequired?: boolean }
): string | null {
  const { emailRequired = true, subjectRequired = false } = options ?? {};

  if (!fields.name.trim()) return "Name is required";
  if (emailRequired && !fields.email.trim()) return "Email is required";
  if (fields.email.trim() && !isValidEmail(fields.email)) return "Enter a valid email address";
  if (!fields.phone.trim()) return "Phone number is required";
  if (!isValidIndianMobile(fields.phone)) return "Enter a valid 10-digit Indian mobile number";
  if (subjectRequired && !fields.subject?.trim()) return "Subject is required";
  if (!fields.message.trim()) return "Message is required";
  if (fields.message.trim().length < 10) return "Message must be at least 10 characters";

  return null;
}
