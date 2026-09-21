import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_NAME = "Pradhan Digital Services";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pradhandigitalservices.com";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || "919294899787";
export const SUPPORT_NUMBER = process.env.NEXT_PUBLIC_SUPPORT_NUMBER || "+91 9294899787";
export const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

export const DISCLAIMER =
  "Pradhan Digital Services is a private facilitation platform and is NOT a government website. We assist citizens in accessing government services through official portals. All government information is sourced from official government websites.";

export const DISCLAIMER_HI =
  "प्रधान डिजिटल सेवाएं एक निजी सुविधा मंच है और यह कोई सरकारी वेबसाइट नहीं है। हम नागरिकों को आधिकारिक पोर्टल के माध्यम से सरकारी सेवाओं तक पहुंचने में सहायता करते हैं।";
