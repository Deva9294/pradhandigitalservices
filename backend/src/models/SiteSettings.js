import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  // General Settings
  siteName: {
    type: String,
    default: 'Pradhan Digital Services'
  },
  siteTagline: {
    type: String,
    default: 'TRUST | DIGITAL | INNOVATION'
  },
  siteDescription: {
    type: String,
    default: 'India\'s Complete Digital Seva Portal'
  },
  siteKeywords: [String],
  
  // Contact Information
  supportPhone: {
    type: String,
    default: '+91 9294899787'
  },
  supportEmail: {
    type: String,
    default: 'support@pradhandigital.com'
  },
  whatsappNumber: {
    type: String,
    default: '919294899787'
  },
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  
  // Social Media
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String,
    linkedin: String
  },
  
  // SEO Settings
  seoTitle: String,
  seoDescription: String,
  ogImage: String,
  
  // Disclaimer
  disclaimer: {
    en: {
      type: String,
      default: 'Pradhan Digital Services is a private digital service centre. This website is not an official government department website. We assist citizens in accessing government services through official portals.'
    },
    hi: {
      type: String,
      default: 'प्रधान डिजिटल सेवाएं एक निजी डिजिटल सेवा केंद्र है। यह वेबसाइट किसी सरकारी विभाग की आधिकारिक वेबसाइट नहीं है। हम नागरिकों को आधिकारिक पोर्टल के माध्यम से सरकारी सेवाओं तक पहुंचने में सहायता करते हैं।'
    }
  },
  
  // Maintenance Mode
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: String,
  
  // Feature Flags
  features: {
    enableWhatsApp: { type: Boolean, default: true },
    enableRecharge: { type: Boolean, default: true },
    enableBillPayment: { type: Boolean, default: true },
    enableDocumentTools: { type: Boolean, default: true },
    enableVacancyAlerts: { type: Boolean, default: true }
  },
  
  // Commission Settings
  commission: {
    agentCommissionRate: { type: Number, default: 10 },
    portalCommissionRate: { type: Number, default: 15 }
  },
  
  // Payment Settings
  payment: {
    razorpayKeyId: String,
    razorpayKeySecret: String,
    minimumAmount: { type: Number, default: 1 }
  },
  
  // Email Settings
  email: {
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPass: String,
    fromEmail: String,
    fromName: String
  },
  
  // SMS Settings
  sms: {
    provider: String,
    apiKey: String,
    senderId: String
  },
  
  // Rate Limiting
  rateLimiting: {
    enabled: { type: Boolean, default: true },
    windowMs: { type: Number, default: 900000 }, // 15 minutes
    maxRequests: { type: Number, default: 100 }
  },
  
  // Updated by
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.model('SiteSettings', siteSettingsSchema);