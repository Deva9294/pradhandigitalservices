import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ClientSideLogic from "@/components/layout/ClientSideLogic";
import { SITE_NAME, SITE_URL, DISCLAIMER } from "@/lib/utils";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ["devanagari"], 
  variable: "--font-noto-sans-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - India's Complete Digital Seva Portal`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Apply for Aadhaar, PAN, Certificates, Government Schemes, Jobs, Recharge & Bill Payment. India's trusted digital seva facilitation platform.",
  keywords: [
    "Pradhan Digital Services",
    "CSC & Online Services",
    "Online Form Apply",
    "Rehti",
    "Sehore",
    "Madhya Pradesh",
    "digital seva",
    "aadhaar",
    "pan card",
    "government services",
    "job updates",
    "recharge",
    "bill payment",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - India's Complete Digital Seva Portal`,
    description: "All Government Services at One Place - Fast, Secure & Reliable",
    images: [{ url: "/brand-icon.svg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "India's Complete Digital Seva Portal",
    images: ["/brand-icon.svg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B192C" },
    { media: "(prefers-color-scheme: dark)", color: "#071018" },
  ],
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: DISCLAIMER,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${inter.variable} ${notoSansDevanagari.variable} font-sans`}>
        <AppProviders>
          <ClientSideLogic />
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
        </AppProviders>
      </body>
    </html>
  );
}
