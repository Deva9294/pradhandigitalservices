import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ClientSideLogic from "@/components/layout/ClientSideLogic";
import LiveVisitorCounter from "@/components/layout/LiveVisitorCounter";
import { SITE_NAME, SITE_URL, DISCLAIMER } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
    verification: {
google: "pk5_eaVyybHjzd-Z80vsqn1W_KQkGD0h5igmLeioSV0",
},
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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - India's Complete Digital Seva Portal`,
    description: "All Government Services at One Place - Fast, Secure & Reliable",
    images: [{ url: "/logo-full-dark.png", width: 935, height: 295, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "India's Complete Digital Seva Portal",
    images: ["/logo-full-dark.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#FFFFFF" },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="font-sans">
        <AppProviders>
          <ClientSideLogic />
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <LiveVisitorCounter />
          <WhatsAppButton />
        </AppProviders>
      </body>
    </html>
  );
}
