export const siteConfig = {
  name: "Pradhan Digital Services",
  brand: "Pradhan Digital Services",
  founder: "Ravi Pradhan",
  tagline: "TRUST | DIGITAL | INNOVATION",
  taglineHi: "भरोसा | डिजिटल | नवाचार",
  description: "Private digital assistance platform for government services, certificates, online forms, job updates, recharge, and bill payments.",
  managedBy: "DevaCore Studios",
  
  // Contact Information
  phone: process.env.NEXT_PUBLIC_SUPPORT_NUMBER || "+91 9294899787",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "919294899787",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "help@pradhandigitalservices.in",
  address: "Rehti, Sehore, Madhya Pradesh, India",
  
  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pradhandigitalservices.in",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1" ? "https://pradhan-backend.onrender.com/api" : "http://localhost:8000/api"),
  
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
  
  // Non-negotiable Disclaimer
  disclaimer: {
    en: "Pradhan Digital Services is a private digital assistance platform. Government services are processed through official portals and applicable government rules. We are not a government department.",
    hi: "प्रधान डिजिटल सेवाएं एक निजी डिजिटल सहायता मंच है। सरकारी सेवाएं आधिकारिक पोर्टलों और लागू सरकारी नियमों के माध्यम से संसाधित की जाती हैं। हम कोई सरकारी विभाग नहीं हैं।",
  },
  
  // Current Year
  currentYear: new Date().getFullYear(),
};

export type SiteConfig = typeof siteConfig;
