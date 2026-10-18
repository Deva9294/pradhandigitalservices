export const siteConfig = {
  name: "Pradhan Digital Services",
  tagline: "Digital Seva Portal",
  description: "Private facilitation platform for government services, certificates, online forms, job updates, recharge, and bill payments.",
  
  // Contact Information
  phone: process.env.NEXT_PUBLIC_SUPPORT_NUMBER || "+91 9294899787",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "919294899787",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@pradhandigitalservices.com",
  address: "Rehti, Sehore, Madhya Pradesh, India",
  
  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pradhandigitalservices.com",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  
  // Social Media
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "",
  },
  
  // Platform Features
  features: {
    multipleServices: true,
    officialPortalLinks: true,
    secureAssistance: true,
    hindiSupport: true,
    transparentCharges: true,
  },
  
  // Disclaimer
  disclaimer: {
    en: "Pradhan Digital Services is a private facilitation platform and is not affiliated with or endorsed by the Government of India or any State Government unless explicitly stated. Government services are accessed through their respective official portals.",
    hi: "प्रधान डिजिटल सेवाएं एक निजी सुविधा मंच है और यह किसी भी सरकारी विभाग से संबद्ध या समर्थित नहीं है। सरकारी सेवाएं उनके आधिकारिक पोर्टल के माध्यम से प्राप्त की जाती हैं।",
  },
  
  // Current Year
  currentYear: new Date().getFullYear(),
};

export type SiteConfig = typeof siteConfig;
