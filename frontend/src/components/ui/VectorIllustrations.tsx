import React from "react";

interface IllustrationProps {
  className?: string;
  size?: number;
}

/**
 * 1. Online Applications Illustration
 */
export function OnlineApplicationsIllustration({ className = "w-16 h-16", size = 64 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="12" y="10" width="56" height="60" rx="8" fill="#0A1B4D" stroke="#FF7A00" strokeWidth="2.5" />
      <rect x="22" y="20" width="24" height="4" rx="2" fill="#FF7A00" />
      <rect x="22" y="30" width="36" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="22" y="38" width="28" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="22" y="46" width="32" height="3" rx="1.5" fill="#94A3B8" />
      <circle cx="54" cy="54" r="14" fill="#FF7A00" stroke="#0A1B4D" strokeWidth="2.5" />
      <path d="M48 54L52 58L60 50" stroke="#0A1B4D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 2. Document Upload Illustration
 */
export function DocumentUploadIllustration({ className = "w-16 h-16", size = 64 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="16" y="16" width="48" height="52" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="2" />
      <path d="M28 16V28H16" fill="#1E293B" stroke="#334155" strokeWidth="2" />
      <rect x="26" y="38" width="28" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="26" y="46" width="20" height="3" rx="1.5" fill="#64748B" />
      <circle cx="48" cy="48" r="16" fill="#0A1B4D" stroke="#FF7A00" strokeWidth="2.5" />
      <path d="M48 55V41M48 41L42 47M48 41L54 47" stroke="#FF7A00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 3. Verification Illustration
 */
export function VerificationIllustration({ className = "w-16 h-16", size = 64 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="32" fill="#0A1B4D" stroke="#FF7A00" strokeWidth="2.5" />
      <path d="M40 18C40 18 54 22 54 34C54 50 40 58 40 58C40 58 26 50 26 34C26 22 40 18 40 18Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 36L38 40L47 31" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 4. Payments Illustration
 */
export function PaymentsIllustration({ className = "w-16 h-16", size = 64 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="10" y="22" width="60" height="38" rx="8" fill="#0A1B4D" stroke="#FF7A00" strokeWidth="2.5" />
      <rect x="10" y="32" width="60" height="8" fill="#1E293B" />
      <rect x="18" y="46" width="12" height="6" rx="2" fill="#E2E8F0" />
      <circle cx="56" cy="49" r="6" fill="#FF7A00" />
      <circle cx="50" cy="49" r="6" fill="#38BDF8" fillOpacity="0.8" />
    </svg>
  );
}

/**
 * 5. PDF Download Illustration
 */
export function PdfDownloadIllustration({ className = "w-16 h-16", size = 64 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="16" y="12" width="48" height="56" rx="8" fill="#0A1B4D" stroke="#FF7A00" strokeWidth="2.5" />
      <rect x="24" y="22" width="22" height="10" rx="3" fill="#EF4444" />
      <text x="27" y="30" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">PDF</text>
      <rect x="24" y="38" width="32" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="24" y="44" width="24" height="3" rx="1.5" fill="#94A3B8" />
      <circle cx="52" cy="54" r="14" fill="#FF7A00" stroke="#0A1B4D" strokeWidth="2.5" />
      <path d="M52 46V56M52 56L47 51M52 56L57 51M46 60H58" stroke="#0A1B4D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 6. Home Delivery Illustration
 */
export function HomeDeliveryIllustration({ className = "w-16 h-16", size = 64 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 26L32 14L54 26L32 38L10 26Z" fill="#1E293B" stroke="#FF7A00" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M10 26V52L32 64V38L10 26Z" fill="#0A1B4D" stroke="#FF7A00" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M54 26V52L32 64V38L54 26Z" fill="#0F172A" stroke="#FF7A00" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="58" cy="54" r="14" fill="#FF7A00" stroke="#0A1B4D" strokeWidth="2.5" />
      <path d="M53 54H63M63 54L59 50M63 54L59 58" stroke="#0A1B4D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 7. Digital Services Hero Vector Illustration
 * Lightweight, original SVG representing digital services at home
 */
export function DigitalServicesHeroIllustration({ className = "w-full max-w-md h-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Pradhan Digital Services Digital Assistance Illustration"
      role="img"
    >
      <defs>
        <linearGradient id="heroCardBg" x1="0" y1="0" x2="340" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A1B4D" />
          <stop offset="1" stopColor="#132766" />
        </linearGradient>
        <linearGradient id="orangeGlow" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FF7A00" />
          <stop offset="1" stopColor="#FF9933" />
        </linearGradient>
      </defs>

      {/* Decorative background glow circles */}
      <circle cx="230" cy="170" r="140" fill="#0A1B4D" fillOpacity="0.3" />
      <circle cx="360" cy="80" r="50" fill="#FF7A00" fillOpacity="0.08" />

      {/* Main Kiosk / Laptop Screen */}
      <rect x="70" y="40" width="320" height="200" rx="16" fill="url(#heroCardBg)" stroke="#22387A" strokeWidth="3" />
      
      {/* Top Window Bar */}
      <rect x="70" y="40" width="320" height="28" rx="16" fill="#071333" />
      <circle cx="92" cy="54" r="5" fill="#EF4444" />
      <circle cx="106" cy="54" r="5" fill="#F59E0B" />
      <circle cx="120" cy="54" r="5" fill="#10B981" />
      <rect x="140" y="48" width="180" height="12" rx="6" fill="#142654" />

      {/* Internal Portal UI Mockup */}
      {/* Left Sidebar */}
      <rect x="85" y="80" width="60" height="140" rx="8" fill="#071333" />
      <rect x="93" y="94" width="44" height="6" rx="3" fill="#FF7A00" />
      <rect x="93" y="110" width="36" height="5" rx="2.5" fill="#64748B" />
      <rect x="93" y="124" width="40" height="5" rx="2.5" fill="#64748B" />
      <rect x="93" y="138" width="32" height="5" rx="2.5" fill="#64748B" />
      <rect x="93" y="152" width="44" height="5" rx="2.5" fill="#64748B" />

      {/* Main Content Area */}
      <rect x="155" y="80" width="220" height="42" rx="10" fill="#0F2156" stroke="#22387A" strokeWidth="1.5" />
      <rect x="170" y="92" width="120" height="8" rx="4" fill="#FFFFFF" />
      <rect x="170" y="106" width="70" height="6" rx="3" fill="#FF7A00" />
      <circle cx="355" cy="101" r="10" fill="#FF7A00" />
      <path d="M352 101L354 103L358 99" stroke="#0A1B4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* 2 Service Cards Inside Window */}
      <rect x="155" y="132" width="105" height="88" rx="10" fill="#071333" stroke="#22387A" strokeWidth="1.5" />
      <rect x="165" y="144" width="40" height="6" rx="3" fill="#38BDF8" />
      <rect x="165" y="158" width="80" height="4" rx="2" fill="#94A3B8" />
      <rect x="165" y="168" width="60" height="4" rx="2" fill="#64748B" />
      <rect x="165" y="190" width="60" height="16" rx="6" fill="#FF7A00" />

      <rect x="270" y="132" width="105" height="88" rx="10" fill="#071333" stroke="#22387A" strokeWidth="1.5" />
      <rect x="280" y="144" width="45" height="6" rx="3" fill="#4ADE80" />
      <rect x="280" y="158" width="80" height="4" rx="2" fill="#94A3B8" />
      <rect x="280" y="168" width="60" height="4" rx="2" fill="#64748B" />
      <rect x="280" y="190" width="60" height="16" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />

      {/* Base Laptop Hinge & Keyboard */}
      <path d="M40 240H420L440 255C440 258 438 260 435 260H25C22 260 20 258 20 255L40 240Z" fill="#142654" stroke="#22387A" strokeWidth="2" />
      <rect x="190" y="244" width="80" height="4" rx="2" fill="#334A8A" />

      {/* Floating Badge 1: Verified Document Certificate */}
      <g filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.4))">
        <rect x="20" y="90" width="100" height="60" rx="12" fill="#0A1B4D" stroke="#FF7A00" strokeWidth="2" />
        <circle cx="45" cy="115" r="12" fill="#FF7A00" />
        <path d="M41 115L44 118L49 112" stroke="#0A1B4D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="64" y="108" width="44" height="6" rx="3" fill="#FFFFFF" />
        <rect x="64" y="118" width="30" height="4" rx="2" fill="#94A3B8" />
      </g>

      {/* Floating Badge 2: Doorstep Speed Post Delivery */}
      <g filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.4))">
        <rect x="330" y="180" width="110" height="54" rx="12" fill="#0A1B4D" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="355" cy="207" r="12" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
        <path d="M349 207H361M361 207L357 203M361 207L357 211" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="375" y="200" width="52" height="6" rx="3" fill="#FFFFFF" />
        <rect x="375" y="210" width="36" height="4" rx="2" fill="#4ADE80" />
      </g>
    </svg>
  );
}
