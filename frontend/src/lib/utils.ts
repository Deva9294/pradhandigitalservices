import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_NAME = "Pradhan Digital Services";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pradhandigitalservices.in";
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? "https://pradhan-backend.onrender.com/api"
    : "http://localhost:8000/api");

/** Express origin (no /api suffix) for fetch calls that include /api/... in the path */
export const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN ||
  API_URL.replace(/\/api\/?$/, "") ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? "https://pradhan-backend.onrender.com"
    : "http://localhost:8000");

export const WHATSAPP_PREFILL =
  "Hi, I need help with Pradhan Digital Services (Rehti, Sehore, MP).";

export function whatsAppUrl(text = WHATSAPP_PREFILL) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function telSupportUrl() {
  const digits = SUPPORT_NUMBER.replace(/\D/g, "");
  return digits ? `tel:+${digits.startsWith("91") ? digits : `91${digits}`}` : "tel:+919294899787";
}
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || "919294899787";
export const SUPPORT_NUMBER = process.env.NEXT_PUBLIC_SUPPORT_NUMBER || "+91 9294899787";
export const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

export const DISCLAIMER =
  "Pradhan Digital Services is a private digital assistance platform. Government services are processed through official portals and applicable government rules. We are not a government department.";

export const DISCLAIMER_HI =
  "प्रधान डिजिटल सेवाएं एक निजी डिजिटल सहायता मंच है। सरकारी सेवाएं आधिकारिक पोर्टलों और लागू सरकारी नियमों के माध्यम से संसाधित की जाती हैं। हम कोई सरकारी विभाग नहीं हैं।";
