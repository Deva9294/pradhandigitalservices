const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'frontend', 'public', 'services');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const logos = {
  // 1. UIDAI Aadhaar
  'uidai-aadhaar.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5722"/>
      <stop offset="50%" stop-color="#FF9800"/>
      <stop offset="100%" stop-color="#E65100"/>
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFF3E0"/>
      <stop offset="100%" stop-color="#FFE0B2"/>
    </radialGradient>
  </defs>
  <!-- Background circle -->
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#FF9800" stroke-width="2"/>
  
  <!-- Aadhaar Sun Rays (16 radiant rays) -->
  <g fill="url(#sunGrad)">
    <polygon points="60,8 63,22 57,22"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(22.5 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(45 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(67.5 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(90 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(112.5 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(135 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(157.5 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(180 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(202.5 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(225 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(247.5 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(270 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(292.5 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(315 60 60)"/>
    <polygon points="60,8 63,22 57,22" transform="rotate(337.5 60 60)"/>
  </g>

  <!-- Sun Disc -->
  <circle cx="60" cy="60" r="34" fill="url(#sunGrad)"/>
  <circle cx="60" cy="60" r="28" fill="url(#centerGlow)"/>

  <!-- Fingerprint Stylized Arcs -->
  <g fill="none" stroke="#D84315" stroke-width="2.2" stroke-linecap="round">
    <path d="M 60 44 A 16 16 0 0 1 76 60"/>
    <path d="M 60 48 A 12 12 0 0 1 72 60"/>
    <path d="M 60 52 A 8 8 0 0 1 68 60"/>
    <path d="M 52 60 A 8 8 0 0 1 60 52"/>
    <path d="M 48 60 A 12 12 0 0 1 60 48"/>
    <path d="M 44 60 A 16 16 0 0 1 60 44"/>
    <path d="M 50 64 C 50 70 54 74 60 74 C 66 74 70 70 70 64"/>
    <path d="M 54 64 C 54 68 57 70 60 70 C 63 70 66 68 66 64"/>
    <circle cx="60" cy="62" r="1.5" fill="#D84315"/>
  </g>

  <!-- Bottom Tricolor Strip -->
  <g transform="translate(0, 88)">
    <rect x="25" y="0" width="70" height="4" fill="#FF9933" rx="1"/>
    <rect x="25" y="4" width="70" height="4" fill="#FFFFFF"/>
    <circle cx="60" cy="6" r="1.8" fill="#000080"/>
    <rect x="25" y="8" width="70" height="4" fill="#138808" rx="1"/>
  </g>
  <text x="60" y="112" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#D84315" text-anchor="middle" letter-spacing="1.5">AADHAAR</text>
</svg>`,

  // 2. PAN / NSDL Income Tax
  'pan-nsdl.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <linearGradient id="panBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B2046"/>
      <stop offset="100%" stop-color="#1A3B70"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE082"/>
      <stop offset="50%" stop-color="#FFB300"/>
      <stop offset="100%" stop-color="#FFA000"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#panBg)" stroke="#FFB300" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="52" fill="none" stroke="#FFB300" stroke-width="1" stroke-dasharray="2,2"/>
  
  <!-- PAN Card Outline in Center -->
  <rect x="24" y="38" width="72" height="44" rx="4" fill="#FFFFFF" stroke="#FFB300" stroke-width="1.5"/>
  <!-- Card Header Strip -->
  <rect x="24" y="38" width="72" height="10" rx="3" fill="#0B2046"/>
  <text x="60" y="45.5" font-family="Arial, sans-serif" font-size="5.5" font-weight="bold" fill="#FFB300" text-anchor="middle">INCOME TAX DEPARTMENT</text>
  
  <!-- Gold Chip -->
  <rect x="30" y="52" width="12" height="9" rx="1.5" fill="url(#goldGrad)" stroke="#B78103" stroke-width="0.5"/>
  <line x1="30" y1="56.5" x2="42" y2="56.5" stroke="#B78103" stroke-width="0.5"/>
  <line x1="36" y1="52" x2="36" y2="61" stroke="#B78103" stroke-width="0.5"/>
  
  <!-- Photo placeholder -->
  <rect x="74" y="52" width="14" height="18" rx="1" fill="#E0E0E0" stroke="#9E9E9E" stroke-width="0.5"/>
  <circle cx="81" cy="58" r="3" fill="#757575"/>
  <path d="M 76 68 C 76 64 78 63 81 63 C 84 63 86 64 86 68 Z" fill="#757575"/>

  <!-- Lines representing details -->
  <rect x="30" y="65" width="38" height="2" fill="#424242"/>
  <rect x="30" y="70" width="28" height="2" fill="#757575"/>
  <rect x="30" y="74" width="34" height="2" fill="#757575"/>

  <!-- Top arc text -->
  <text x="60" y="24" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold" fill="#FFE082" text-anchor="middle" letter-spacing="1">आयकर विभाग</text>
  <!-- Bottom PAN bold text -->
  <text x="60" y="104" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="#FFB300" text-anchor="middle" letter-spacing="2">PAN CARD</text>
</svg>`,

  // 3. ECI Voter ID
  'eci-voter.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <linearGradient id="eciTricolor" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF9933"/>
      <stop offset="50%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#138808"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#000080" stroke-width="3"/>
  <circle cx="60" cy="60" r="53" fill="none" stroke="url(#eciTricolor)" stroke-width="3"/>

  <!-- Ashoka Chakra stylized rays in background -->
  <circle cx="60" cy="55" r="26" fill="#F0F4F8"/>
  <circle cx="60" cy="55" r="26" fill="none" stroke="#000080" stroke-width="1" stroke-dasharray="2,3"/>

  <!-- Raised Voting Index Finger with Inked Mark -->
  <g transform="translate(48, 30)">
    <!-- Palm / fist silhouette -->
    <path d="M 6 32 C 4 30 2 34 2 38 C 2 46 8 50 16 50 C 24 50 28 46 28 38 C 28 34 24 32 20 32 Z" fill="#E0A96D"/>
    <!-- Index Finger Pointing Up -->
    <rect x="8" y="2" width="9" height="34" rx="4.5" fill="#E0A96D"/>
    <!-- Nail -->
    <rect x="9.5" y="4" width="6" height="7" rx="2" fill="#F5CBA7"/>
    <!-- Violet/Black Indelible Ink Mark -->
    <rect x="11.5" y="7" width="2" height="18" rx="1" fill="#4A148C"/>
  </g>

  <!-- Ballot Tick / Checkmark in Green -->
  <path d="M 68 55 L 75 62 L 88 45" fill="none" stroke="#138808" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- ECI Banner & Text -->
  <text x="60" y="20" font-family="Arial, sans-serif" font-size="6.5" font-weight="900" fill="#000080" text-anchor="middle">भारत निर्वाचन आयोग</text>
  <rect x="30" y="94" width="60" height="16" rx="8" fill="#000080"/>
  <text x="60" y="105.5" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">VOTER ID</text>
</svg>`,

  // 4. Samagra MP
  'samagra-mp.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <linearGradient id="samagraSky" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E8F5E9"/>
      <stop offset="100%" stop-color="#C8E6C9"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#2E7D32" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="52" fill="url(#samagraSky)"/>

  <!-- Protective Arch / Umbrella Hands in Tricolor -->
  <path d="M 22 55 C 22 30 98 30 98 55" fill="none" stroke="#FF7A00" stroke-width="5" stroke-linecap="round"/>
  <path d="M 28 58 C 28 38 92 38 92 58" fill="none" stroke="#1565C0" stroke-width="3" stroke-linecap="round"/>

  <!-- Family Figures (Parents + Children) -->
  <!-- Father -->
  <circle cx="44" cy="50" r="5" fill="#1565C0"/>
  <path d="M 38 68 C 38 58 50 58 50 68 Z" fill="#1565C0"/>
  
  <!-- Mother -->
  <circle cx="76" cy="50" r="5" fill="#C2185B"/>
  <path d="M 70 68 C 70 58 82 58 82 68 Z" fill="#C2185B"/>

  <!-- Boy & Girl in Center -->
  <circle cx="56" cy="57" r="3.5" fill="#2E7D32"/>
  <path d="M 52 72 C 52 64 60 64 60 72 Z" fill="#2E7D32"/>
  <circle cx="65" cy="58" r="3.5" fill="#FF8F00"/>
  <path d="M 61 72 C 61 65 69 65 69 72 Z" fill="#FF8F00"/>

  <!-- Holding Hands connecting line -->
  <line x1="42" y1="62" x2="78" y2="62" stroke="#455A64" stroke-width="1.5"/>

  <!-- Bottom Badges -->
  <rect x="20" y="80" width="80" height="15" rx="7.5" fill="#2E7D32"/>
  <text x="60" y="91" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">समग्र सामाजिक सुरक्षा</text>
  <text x="60" y="108" font-family="Arial, sans-serif" font-size="7.5" font-weight="900" fill="#1B5E20" text-anchor="middle">SAMAGRA MP</text>
</svg>`,

  // 5. Ayushman Bharat PM-JAY
  'ayushman-pmjay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#00838F" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E0F7FA"/>

  <!-- Twin Leaves Heart / Shield (Iconic PM-JAY Symbol) -->
  <!-- Left Saffron Leaf -->
  <path d="M 60 75 C 60 75 32 60 32 40 C 32 28 44 24 54 30 C 58 32 60 36 60 36" fill="#FF7A00"/>
  <!-- Right Green Leaf -->
  <path d="M 60 75 C 60 75 88 60 88 40 C 88 28 76 24 66 30 C 62 32 60 36 60 36" fill="#2E7D32"/>

  <!-- Center White Medical Cross -->
  <g transform="translate(60, 48)">
    <rect x="-4" y="-14" width="8" height="28" rx="2" fill="#FFFFFF"/>
    <rect x="-14" y="-4" width="28" height="8" rx="2" fill="#FFFFFF"/>
    <!-- Small blue circle in center -->
    <circle cx="0" cy="0" r="2.5" fill="#00838F"/>
  </g>

  <!-- PM-JAY Bold Tag -->
  <rect x="22" y="82" width="76" height="16" rx="8" fill="#00838F"/>
  <text x="60" y="93.5" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">PM-JAY</text>
  <text x="60" y="110" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold" fill="#006064" text-anchor="middle">आयुष्मान भारत</text>
</svg>`,

  // 6. PM-Kisan
  'pm-kisan.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#2E7D32" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#F1F8E9"/>

  <!-- Rising Sun -->
  <circle cx="60" cy="45" r="18" fill="#FFA000"/>
  
  <!-- Green Rolling Fields / Farmland -->
  <path d="M 12 70 Q 35 55 60 65 Q 85 75 108 65 L 108 95 L 12 95 Z" fill="#43A047"/>
  <path d="M 12 78 Q 40 68 65 76 Q 90 84 108 76 L 108 95 L 12 95 Z" fill="#2E7D32"/>

  <!-- Golden Wheat Stalk in Foreground -->
  <g transform="translate(60, 48)">
    <line x1="0" y1="-20" x2="0" y2="25" stroke="#F57F17" stroke-width="2.5"/>
    <ellipse cx="-5" cy="-16" rx="4" ry="2" transform="rotate(-30 -5 -16)" fill="#FFD54F" stroke="#F57F17" stroke-width="0.7"/>
    <ellipse cx="5" cy="-16" rx="4" ry="2" transform="rotate(30 5 -16)" fill="#FFD54F" stroke="#F57F17" stroke-width="0.7"/>
    <ellipse cx="-6" cy="-8" rx="5" ry="2.5" transform="rotate(-30 -6 -8)" fill="#FFD54F" stroke="#F57F17" stroke-width="0.7"/>
    <ellipse cx="6" cy="-8" rx="5" ry="2.5" transform="rotate(30 6 -8)" fill="#FFD54F" stroke="#F57F17" stroke-width="0.7"/>
    <ellipse cx="-7" cy="0" rx="5" ry="2.5" transform="rotate(-30 -7 0)" fill="#FFD54F" stroke="#F57F17" stroke-width="0.7"/>
    <ellipse cx="7" cy="0" rx="5" ry="2.5" transform="rotate(30 7 0)" fill="#FFD54F" stroke="#F57F17" stroke-width="0.7"/>
    <ellipse cx="0" cy="-22" rx="2.5" ry="5" fill="#FFD54F" stroke="#F57F17" stroke-width="0.7"/>
  </g>

  <!-- Title Banner -->
  <rect x="20" y="88" width="80" height="18" rx="9" fill="#1B5E20"/>
  <text x="60" y="100.5" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">PM-KISAN</text>
  <text x="60" y="24" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#2E7D32" text-anchor="middle">प्रधानमंत्री किसान सम्मान निधि</text>
</svg>`,

  // 7. Parivahan MoRTH (Driving Licence & RC)
  'parivahan.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#0D47A1" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E3F2FD"/>

  <!-- Highway Road Meeting Horizon -->
  <polygon points="60,32 50,78 70,78" fill="#37474F"/>
  <line x1="60" y1="36" x2="60" y2="44" stroke="#FFFFFF" stroke-width="1.5"/>
  <line x1="60" y1="48" x2="60" y2="58" stroke="#FFFFFF" stroke-width="1.8"/>
  <line x1="60" y1="62" x2="60" y2="76" stroke="#FFFFFF" stroke-width="2.2"/>

  <!-- Steering Wheel & Shield -->
  <circle cx="60" cy="52" r="22" fill="none" stroke="#0D47A1" stroke-width="3.5"/>
  <circle cx="60" cy="52" r="6" fill="#0D47A1"/>
  <line x1="60" y1="30" x2="60" y2="46" stroke="#0D47A1" stroke-width="2.5"/>
  <line x1="41" y1="63" x2="55" y2="55" stroke="#0D47A1" stroke-width="2.5"/>
  <line x1="79" y1="63" x2="65" y2="55" stroke="#0D47A1" stroke-width="2.5"/>

  <!-- Car Silhouette -->
  <path d="M 52 68 L 55 63 Q 60 61 65 63 L 68 68 Q 69 70 67 71 L 53 71 Q 51 70 52 68 Z" fill="#FF7A00"/>
  <circle cx="54" cy="71" r="1.8" fill="#212121"/>
  <circle cx="66" cy="71" r="1.8" fill="#212121"/>

  <!-- MoRTH Banner -->
  <rect x="18" y="84" width="84" height="17" rx="8.5" fill="#0D47A1"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">PARIVAHAN</text>
  <text x="60" y="112" font-family="Arial, sans-serif" font-size="6.5" font-weight="bold" fill="#0D47A1" text-anchor="middle">DRIVING LICENCE &amp; RC</text>
</svg>`,

  // 8. Passport Seva (MEA)
  'passport-seva.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <linearGradient id="passportNavy" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A1E3F"/>
      <stop offset="100%" stop-color="#14346B"/>
    </linearGradient>
    <linearGradient id="passportGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE082"/>
      <stop offset="100%" stop-color="#FFB300"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#passportNavy)" stroke="#FFB300" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="52" fill="none" stroke="#FFB300" stroke-width="1" stroke-dasharray="2,2"/>

  <!-- Passport Book Shape -->
  <rect x="36" y="28" width="48" height="60" rx="3" fill="#07152B" stroke="url(#passportGold)" stroke-width="1.5"/>
  
  <!-- Ashok Stambh Emblem in Center -->
  <g transform="translate(60, 50)" fill="url(#passportGold)">
    <!-- Lion Head representation -->
    <path d="M -8 -10 C -8 -16 8 -16 8 -10 C 8 -7 6 -5 4 -3 L 4 4 L -4 4 L -4 -3 C -6 -5 -8 -7 -8 -10 Z"/>
    <rect x="-6" y="4" width="12" height="2"/>
    <!-- Wheel Base -->
    <circle cx="0" cy="8" r="3" fill="none" stroke="#FFB300" stroke-width="1"/>
    <rect x="-10" y="12" width="20" height="2.5" rx="0.5"/>
  </g>

  <text x="60" y="38" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="url(#passportGold)" text-anchor="middle" letter-spacing="1">PASSPORT</text>
  <text x="60" y="80" font-family="Arial, sans-serif" font-size="4.5" font-weight="bold" fill="url(#passportGold)" text-anchor="middle">REPUBLIC OF INDIA</text>

  <!-- Title Bottom -->
  <rect x="20" y="96" width="80" height="15" rx="7.5" fill="#FFB300"/>
  <text x="60" y="106.5" font-family="Arial, sans-serif" font-size="7.5" font-weight="900" fill="#0A1E3F" text-anchor="middle" letter-spacing="1">PASSPORT SEVA</text>
</svg>`,

  // 9. NFSA Ration Card
  'ration-nfsa.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#E65100" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#FFF8E1"/>

  <!-- Wheat Ear Stalks Left and Right -->
  <g stroke="#F57F17" fill="#FFD54F" stroke-width="1">
    <!-- Left Stalk -->
    <path d="M 32 60 Q 32 35 48 25" fill="none" stroke-width="2"/>
    <ellipse cx="36" cy="48" rx="4" ry="2" transform="rotate(40 36 48)"/>
    <ellipse cx="40" cy="40" rx="4" ry="2" transform="rotate(40 40 40)"/>
    <ellipse cx="44" cy="32" rx="4" ry="2" transform="rotate(40 44 32)"/>
    <!-- Right Stalk -->
    <path d="M 88 60 Q 88 35 72 25" fill="none" stroke-width="2"/>
    <ellipse cx="84" cy="48" rx="4" ry="2" transform="rotate(-40 84 48)"/>
    <ellipse cx="80" cy="40" rx="4" ry="2" transform="rotate(-40 80 40)"/>
    <ellipse cx="76" cy="32" rx="4" ry="2" transform="rotate(-40 76 32)"/>
  </g>

  <!-- Grain Bowl in Center -->
  <path d="M 40 55 C 40 72 80 72 80 55 Z" fill="#E65100"/>
  <ellipse cx="60" cy="55" rx="20" ry="5" fill="#FFA726"/>
  <!-- Food Grains heap -->
  <path d="M 42 55 Q 60 42 78 55 Z" fill="#FFF3E0"/>

  <!-- NFSA Banner -->
  <rect x="22" y="82" width="76" height="17" rx="8.5" fill="#E65100"/>
  <text x="60" y="94" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">RATION CARD</text>
  <text x="60" y="110" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#BF360C" text-anchor="middle">खाद्य एवं नागरिक आपूर्ति</text>
</svg>`,

  // 10. MP Lok Seva Guarantee (Certificates)
  'mp-lokseva.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#00695C" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E0F2F1"/>

  <!-- MP Stupa Edge / Seal Motif -->
  <circle cx="60" cy="52" r="28" fill="#FFFFFF" stroke="#00695C" stroke-width="1.5"/>

  <!-- Banyan Tree & Ashok Emblem stylized -->
  <path d="M 60 30 C 50 30 46 40 50 48 C 45 49 44 54 48 57 C 52 59 55 58 57 58 L 57 66 L 63 66 L 63 58 C 65 58 68 59 72 57 C 76 54 75 49 70 48 C 74 40 70 30 60 30 Z" fill="#2E7D32"/>
  
  <!-- Pillars / Stambh silhouette -->
  <rect x="58" y="52" width="4" height="15" fill="#FFB300"/>

  <!-- Official Guarantee Seal Ring -->
  <text x="60" y="24" font-family="Arial, sans-serif" font-size="6.5" font-weight="bold" fill="#004D40" text-anchor="middle">लोक सेवा गारंटी म.प्र.</text>
  
  <rect x="18" y="82" width="84" height="17" rx="8.5" fill="#00695C"/>
  <text x="60" y="94" font-family="Arial, sans-serif" font-size="8" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">MP e-DISTRICT</text>
  <text x="60" y="110" font-family="Arial, sans-serif" font-size="6.5" font-weight="bold" fill="#004D40" text-anchor="middle">आय / जाति / निवास प्रमाण पत्र</text>
</svg>`,

  // 11. Ladli Behna Yojana (MP Govt)
  'ladli-behna.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#D81B60" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#FCE4EC"/>

  <!-- Woman & Sister / Girl child silhouette in Soft Pink / Saffron -->
  <!-- Woman Silhouette -->
  <circle cx="48" cy="42" r="7" fill="#C2185B"/>
  <path d="M 38 66 C 38 53 58 53 58 66 Z" fill="#C2185B"/>
  <path d="M 45 42 Q 36 46 36 56 Q 42 56 46 50 Z" fill="#880E4F"/> <!-- Dupatta / Aanchal -->

  <!-- Sister / Girl Child -->
  <circle cx="72" cy="48" r="5" fill="#E91E63"/>
  <path d="M 64 68 C 64 58 80 58 80 68 Z" fill="#E91E63"/>

  <!-- Lotus Blossom at Base -->
  <path d="M 60 76 C 54 72 48 76 60 67 C 72 76 66 72 60 76 Z" fill="#FF4081"/>
  <path d="M 60 76 C 50 78 44 74 48 80 C 54 80 58 78 60 76 Z" fill="#F48FB1"/>
  <path d="M 60 76 C 70 78 76 74 72 80 C 66 80 62 78 60 76 Z" fill="#F48FB1"/>

  <!-- Banner -->
  <rect x="16" y="86" width="88" height="17" rx="8.5" fill="#C2185B"/>
  <text x="60" y="98" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">लाड़ली बहना</text>
  <text x="60" y="24" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#880E4F" text-anchor="middle">मध्य प्रदेश शासन</text>
</svg>`,

  // 12. MP Rojgar Portal
  'mp-rojgar.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#1565C0" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E3F2FD"/>

  <!-- Industrial Gear in Blue -->
  <g transform="translate(60, 50)" fill="#1565C0">
    <circle cx="0" cy="0" r="22"/>
    <circle cx="0" cy="0" r="14" fill="#FFFFFF"/>
    <!-- Gear teeth -->
    <rect x="-3" y="-26" width="6" height="5"/>
    <rect x="-3" y="21" width="6" height="5"/>
    <rect x="-26" y="-3" width="5" height="6"/>
    <rect x="21" y="-3" width="5" height="6"/>
    <rect x="-19" y="-19" width="6" height="6"/>
    <rect x="13" y="13" width="6" height="6"/>
    <rect x="-19" y="13" width="6" height="6"/>
    <rect x="13" y="-19" width="6" height="6"/>
  </g>

  <!-- Handshake in center -->
  <path d="M 48 50 L 55 45 L 60 49 L 65 45 L 72 50 L 66 56 L 60 52 L 54 56 Z" fill="#FF7A00"/>

  <rect x="18" y="82" width="84" height="17" rx="8.5" fill="#1565C0"/>
  <text x="60" y="94" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">MP ROJGAR</text>
  <text x="60" y="110" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#0D47A1" text-anchor="middle">रोजगार पंजीयन पोर्टल</text>
</svg>`,

  // 13. DigiLocker
  'digilocker.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#0072BB" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E8F4F8"/>

  <!-- Cloud Document Shape -->
  <path d="M 40 60 A 14 14 0 0 1 65 48 A 18 18 0 0 1 85 62 A 12 12 0 0 1 78 78 L 40 78 A 12 12 0 0 1 40 60 Z" fill="#0072BB"/>

  <!-- Lock inside Cloud -->
  <!-- Lock shackle -->
  <path d="M 54 55 L 54 50 A 6 6 0 0 1 66 50 L 66 55" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Lock Body -->
  <rect x="50" y="55" width="20" height="15" rx="3" fill="#00A859"/>
  <!-- Keyhole -->
  <circle cx="60" cy="61" r="2" fill="#FFFFFF"/>
  <polygon points="59,61 61,61 61.5,66 58.5,66" fill="#FFFFFF"/>

  <!-- DigiLocker Banner -->
  <rect x="18" y="86" width="84" height="17" rx="8.5" fill="#0072BB"/>
  <text x="60" y="98" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">DIGILOCKER</text>
  <text x="60" y="24" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#00A859" text-anchor="middle">डिजिटल लॉकर</text>
</svg>`,

  // 14. UMANG
  'umang.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#0B3C5D" stroke-width="2.5"/>
  
  <!-- Three concentric colored ring arcs (Saffron, Blue, Green) -->
  <path d="M 32 45 A 32 32 0 0 1 88 45" fill="none" stroke="#FF7A00" stroke-width="6" stroke-linecap="round"/>
  <path d="M 38 60 A 24 24 0 0 1 82 60" fill="none" stroke="#1D2731" stroke-width="5" stroke-linecap="round"/>
  <path d="M 44 75 A 16 16 0 0 1 76 75" fill="none" stroke="#328CC1" stroke-width="4.5" stroke-linecap="round"/>

  <!-- Stylized U Letterform in Center -->
  <path d="M 48 40 L 48 58 A 12 12 0 0 0 72 58 L 72 40" fill="none" stroke="#0B3C5D" stroke-width="7" stroke-linecap="round"/>

  <rect x="22" y="86" width="76" height="17" rx="8.5" fill="#0B3C5D"/>
  <text x="60" y="98" font-family="Arial, sans-serif" font-size="9" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">UMANG</text>
  <text x="60" y="22" font-family="Arial, sans-serif" font-size="6.5" font-weight="bold" fill="#328CC1" text-anchor="middle">एक मंच - सभी सरकारी सेवाएं</text>
</svg>`,

  // 15. EPFO (PF & UAN)
  'epfo.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#0D47A1" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E8EAF6"/>

  <!-- Blue Gear & Sun rays -->
  <g transform="translate(60, 50)" fill="#0D47A1">
    <circle cx="0" cy="0" r="24"/>
    <circle cx="0" cy="0" r="16" fill="#FFFFFF"/>
    <!-- Cog notches -->
    <rect x="-3" y="-28" width="6" height="5"/>
    <rect x="-3" y="23" width="6" height="5"/>
    <rect x="-28" y="-3" width="5" height="6"/>
    <rect x="23" y="-3" width="5" height="6"/>
    <!-- Rising Sun in center -->
    <path d="M -12 4 A 12 12 0 0 1 12 4 Z" fill="#F57F17"/>
    <line x1="0" y1="-8" x2="0" y2="4" stroke="#F57F17" stroke-width="2"/>
    <line x1="-8" y1="-3" x2="0" y2="4" stroke="#F57F17" stroke-width="1.5"/>
    <line x1="8" y1="-3" x2="0" y2="4" stroke="#F57F17" stroke-width="1.5"/>
  </g>

  <!-- Golden Grain Stalk on left -->
  <g stroke="#F57F17" fill="#FFD54F" stroke-width="0.8">
    <path d="M 40 68 Q 36 50 44 38" fill="none" stroke-width="1.5"/>
    <ellipse cx="38" cy="54" rx="3" ry="1.5" transform="rotate(30 38 54)"/>
    <ellipse cx="40" cy="46" rx="3" ry="1.5" transform="rotate(30 40 46)"/>
  </g>

  <!-- Banner -->
  <rect x="20" y="84" width="80" height="17" rx="8.5" fill="#0D47A1"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">EPFO / UAN</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#1A237E" text-anchor="middle">कर्मचारी भविष्य निधि</text>
</svg>`,

  // 16. e-Shram
  'eshram.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#F57F17" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#FFFDE7"/>

  <!-- Cogwheel & Worker Safety Helmet -->
  <circle cx="60" cy="50" r="22" fill="#263238"/>
  <circle cx="60" cy="50" r="17" fill="#FFFFFF"/>

  <!-- Safety Helmet in Yellow/Orange -->
  <path d="M 44 54 C 44 40 76 40 76 54 Z" fill="#FBC02D"/>
  <rect x="42" y="52" width="36" height="4" rx="2" fill="#F57F17"/>
  <rect x="58" y="40" width="4" height="14" fill="#F57F17"/>

  <!-- Twin Wrenches crossing at base -->
  <line x1="46" y1="72" x2="74" y2="60" stroke="#78909C" stroke-width="3" stroke-linecap="round"/>
  <line x1="46" y1="60" x2="74" y2="72" stroke="#78909C" stroke-width="3" stroke-linecap="round"/>

  <!-- Banner -->
  <rect x="20" y="84" width="80" height="17" rx="8.5" fill="#E65100"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">e-SHRAM</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#BF360C" text-anchor="middle">श्रम एवं रोजगार मंत्रालय</text>
</svg>`,

  // 17. MP Bhulekh (Khasra & Khatauni)
  'mp-bhulekh.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#2E7D32" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E8F5E9"/>

  <!-- Cadastral Land Survey Map Geometry -->
  <polygon points="30,40 55,30 85,38 90,65 65,75 35,68" fill="#C8E6C9" stroke="#2E7D32" stroke-width="2"/>
  <!-- Sub-plot boundary lines (Khasra numbers) -->
  <line x1="55" y1="30" x2="65" y2="75" stroke="#2E7D32" stroke-width="1.5" stroke-dasharray="2,2"/>
  <line x1="30" y1="52" x2="90" y2="52" stroke="#2E7D32" stroke-width="1.5" stroke-dasharray="2,2"/>

  <!-- Plot markers -->
  <circle cx="45" cy="42" r="3" fill="#FF7A00"/>
  <text x="45" y="43" font-family="Arial, sans-serif" font-size="3" font-weight="bold" fill="#FFFFFF" text-anchor="middle">12</text>

  <circle cx="72" cy="44" r="3" fill="#1565C0"/>
  <text x="72" y="45" font-family="Arial, sans-serif" font-size="3" font-weight="bold" fill="#FFFFFF" text-anchor="middle">13</text>

  <circle cx="50" cy="62" r="3" fill="#2E7D32"/>
  <text x="50" y="63" font-family="Arial, sans-serif" font-size="3" font-weight="bold" fill="#FFFFFF" text-anchor="middle">14</text>

  <!-- Banner -->
  <rect x="18" y="84" width="84" height="17" rx="8.5" fill="#1B5E20"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">MP BHULEKH</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#2E7D32" text-anchor="middle">खसरा / खतौनी / नक्शा</text>
</svg>`,

  // 18. MP Electricity (Bijli Bill)
  'mp-electricity.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#0277BD" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E1F5FE"/>

  <!-- Power Tower / Transmission Grid Silhouette -->
  <polygon points="60,25 54,65 66,65" fill="none" stroke="#01579B" stroke-width="2"/>
  <line x1="45" y1="42" x2="75" y2="42" stroke="#01579B" stroke-width="2"/>
  <line x1="48" y1="55" x2="72" y2="55" stroke="#01579B" stroke-width="2"/>
  
  <!-- High Voltage Flash Bolt in Gold/Orange -->
  <polygon points="63,26 50,46 59,46 54,68 70,44 60,44" fill="#FFC107" stroke="#FF8F00" stroke-width="1.5"/>

  <!-- Banner -->
  <rect x="20" y="84" width="80" height="17" rx="8.5" fill="#0277BD"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">BIJLI BILL</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#01579B" text-anchor="middle">म.प्र. विद्युत वितरण (MPPKVVCL)</text>
</svg>`,

  // 19. LPG Gas Cylinder
  'lpg-cylinder.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#D32F2F" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#FFEBEE"/>

  <!-- Red LPG Gas Cylinder Body -->
  <!-- Top Collar Ring -->
  <rect x="52" y="24" width="16" height="5" rx="1.5" fill="#B71C1C"/>
  <rect x="50" y="28" width="20" height="4" rx="1" fill="#D32F2F"/>
  <!-- Cylinder Main Body -->
  <path d="M 46 40 C 46 34 74 34 74 40 L 74 72 C 74 76 46 76 46 72 Z" fill="#D32F2F"/>
  <!-- Highlight Shading -->
  <rect x="50" y="40" width="6" height="32" fill="#E57373" opacity="0.6"/>
  <!-- Base Stand Ring -->
  <rect x="49" y="72" width="22" height="4" rx="1" fill="#B71C1C"/>

  <!-- Blue & Gold Flame at top -->
  <g transform="translate(60, 20)">
    <path d="M 0 -8 C 4 -4 5 0 0 4 C -5 0 -4 -4 0 -8 Z" fill="#29B6F6"/>
    <path d="M 0 -5 C 2 -2 3 0 0 2 C -3 0 -2 -2 0 -5 Z" fill="#FFF59D"/>
  </g>

  <!-- Banner -->
  <rect x="22" y="84" width="76" height="17" rx="8.5" fill="#D32F2F"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">LPG GAS</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#B71C1C" text-anchor="middle">INDANE / BHARAT / HP</text>
</svg>`,

  // 20. FASTag (NPCI)
  'fastag.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#0288D1" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E1F5FE"/>

  <!-- FASTag Badge Card Shape -->
  <rect x="25" y="36" width="70" height="42" rx="4" fill="#0288D1"/>
  <!-- Orange streak -->
  <polygon points="25,36 45,36 35,78 25,78" fill="#FF7A00"/>
  <!-- White Center Strip -->
  <rect x="42" y="44" width="48" height="26" rx="2" fill="#FFFFFF"/>

  <!-- RFID Waves Symbol -->
  <g stroke="#0288D1" fill="none" stroke-width="2" stroke-linecap="round">
    <path d="M 54 52 A 8 8 0 0 1 54 62"/>
    <path d="M 50 48 A 14 14 0 0 1 50 66"/>
    <path d="M 46 44 A 20 20 0 0 1 46 70"/>
  </g>

  <text x="73" y="60" font-family="Arial, sans-serif" font-size="9" font-weight="900" fill="#0288D1">TAG</text>

  <!-- Banner -->
  <rect x="22" y="86" width="76" height="17" rx="8.5" fill="#01579B"/>
  <text x="60" y="98" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">FASTag</text>
  <text x="60" y="26" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#0288D1" text-anchor="middle">NPCI ई-टोल सेवा</text>
</svg>`,

  // 21. CRS India (Birth & Death Registration)
  'crs-india.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#004D40" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E0F2F1"/>

  <!-- Certificate Scroll Ribbon -->
  <rect x="36" y="28" width="48" height="54" rx="3" fill="#FFFFFF" stroke="#004D40" stroke-width="2"/>
  <line x1="42" y1="38" x2="78" y2="38" stroke="#FF7A00" stroke-width="2.5"/>
  <line x1="42" y1="46" x2="74" y2="46" stroke="#B0BEC5" stroke-width="2"/>
  <line x1="42" y1="52" x2="70" y2="52" stroke="#B0BEC5" stroke-width="2"/>
  <line x1="42" y1="58" x2="76" y2="58" stroke="#B0BEC5" stroke-width="2"/>
  
  <!-- Golden Seal Stamp at bottom right of certificate -->
  <circle cx="70" cy="68" r="7" fill="#FFA000"/>
  <circle cx="70" cy="68" r="5" fill="#FFC107"/>
  <path d="M 68 75 L 70 82 L 72 75 Z" fill="#FFA000"/>

  <!-- Banner -->
  <rect x="16" y="86" width="88" height="17" rx="8.5" fill="#004D40"/>
  <text x="60" y="98" font-family="Arial, sans-serif" font-size="7.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">CRS BIRTH &amp; DEATH</text>
  <text x="60" y="22" font-family="Arial, sans-serif" font-size="6.5" font-weight="bold" fill="#004D40" text-anchor="middle">जन्म एवं मृत्यु प्रमाण पत्र</text>
</svg>`,

  // 22. MPESB (Vyapam)
  'mpesb.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#283593" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E8EAF6"/>

  <!-- Graduation Cap & Open Book -->
  <!-- Cap Top Diamond -->
  <polygon points="60,28 85,38 60,48 35,38" fill="#283593"/>
  <polygon points="46,43 46,54 74,54 74,43" fill="#1A237E"/>
  <!-- Tassel -->
  <line x1="80" y1="40" x2="84" y2="52" stroke="#FFB300" stroke-width="1.8"/>
  <circle cx="84" cy="53" r="1.5" fill="#FFB300"/>

  <!-- Open Book below -->
  <path d="M 60 58 Q 44 54 36 60 L 36 76 Q 46 72 60 76 Q 74 72 84 76 L 84 60 Q 76 54 60 58 Z" fill="#FFFFFF" stroke="#283593" stroke-width="1.5"/>
  <line x1="60" y1="58" x2="60" y2="76" stroke="#283593" stroke-width="1.5"/>

  <!-- Banner -->
  <rect x="18" y="84" width="84" height="17" rx="8.5" fill="#283593"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">MPESB / व्यापम</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#1A237E" text-anchor="middle">कर्मचारी चयन मंडल म.प्र.</text>
</svg>`,

  // 23. MPPSC
  'mppsc.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#880E4F" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#FCE4EC"/>

  <!-- Seal Stambh & Rays -->
  <circle cx="60" cy="50" r="22" fill="#880E4F"/>
  <circle cx="60" cy="50" r="18" fill="#FFFFFF"/>
  <rect x="58" y="38" width="4" height="20" fill="#FFB300"/>
  <circle cx="60" cy="48" r="3" fill="#880E4F"/>

  <!-- Banner -->
  <rect x="22" y="84" width="76" height="17" rx="8.5" fill="#880E4F"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">MPPSC</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#4A148C" text-anchor="middle">म.प्र. लोक सेवा आयोग</text>
</svg>`,

  // 24. SSC
  'ssc.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#B71C1C" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#FFEBEE"/>

  <!-- SSC Blue & Red Circular Crest -->
  <circle cx="60" cy="50" r="24" fill="#0D47A1"/>
  <circle cx="60" cy="50" r="18" fill="#FFFFFF"/>
  <circle cx="60" cy="50" r="15" fill="#B71C1C"/>
  <text x="60" y="54" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle">SSC</text>

  <!-- Banner -->
  <rect x="18" y="84" width="84" height="17" rx="8.5" fill="#B71C1C"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">STAFF SELECTION</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#0D47A1" text-anchor="middle">कर्मचारी चयन आयोग</text>
</svg>`,

  // 25. Indian Railways (RRB & IRCTC)
  'railway.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#0D47A1" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E8EAF6"/>

  <!-- Circular Wheel with Stars & Ashok Emblem -->
  <circle cx="60" cy="50" r="25" fill="#0D47A1"/>
  <circle cx="60" cy="50" r="21" fill="#FFFFFF"/>

  <!-- Train Engine Front Silhouette -->
  <rect x="48" y="38" width="24" height="20" rx="3" fill="#C2185B"/>
  <rect x="52" y="42" width="6" height="5" rx="1" fill="#FFFFFF"/>
  <rect x="62" y="42" width="6" height="5" rx="1" fill="#FFFFFF"/>
  <circle cx="60" cy="52" r="3" fill="#FFEB3B"/> <!-- Headlight -->
  <rect x="46" y="58" width="28" height="4" fill="#212121"/>
  <!-- Track Cowcatcher -->
  <polygon points="50,62 70,62 74,66 46,66" fill="#424242"/>

  <!-- Banner -->
  <rect x="16" y="84" width="88" height="17" rx="8.5" fill="#0D47A1"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">INDIAN RAILWAYS</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#C2185B" text-anchor="middle">रेलवे भर्ती / IRCTC</text>
</svg>`,

  // 26. SBI (State Bank of India)
  'sbi.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#0080C6" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#F0F8FF"/>

  <!-- SBI Iconic Blue Keyhole Circle -->
  <circle cx="60" cy="50" r="25" fill="#0080C6"/>
  <!-- White Center Keyhole Notch -->
  <circle cx="60" cy="50" r="7" fill="#FFFFFF"/>
  <rect x="57" y="50" width="6" height="25" fill="#FFFFFF"/>

  <!-- Banner -->
  <rect x="22" y="86" width="76" height="17" rx="8.5" fill="#0080C6"/>
  <text x="60" y="98" font-family="Arial, sans-serif" font-size="9" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">SBI BANK</text>
  <text x="60" y="24" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold" fill="#0080C6" text-anchor="middle">STATE BANK OF INDIA</text>
</svg>`,

  // 27. IBPS
  'ibps.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#00796B" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E0F2F1"/>

  <!-- IBPS Crest -->
  <circle cx="60" cy="50" r="23" fill="#00796B"/>
  <circle cx="60" cy="50" r="17" fill="#FFFFFF"/>
  <!-- Scales of banking -->
  <rect x="59" y="38" width="2" height="20" fill="#00796B"/>
  <line x1="48" y1="44" x2="72" y2="44" stroke="#00796B" stroke-width="2"/>
  <polygon points="48,46 44,54 52,54" fill="#FFB300"/>
  <polygon points="72,46 68,54 76,54" fill="#FFB300"/>

  <rect x="22" y="84" width="76" height="17" rx="8.5" fill="#00796B"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">IBPS</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#004D40" text-anchor="middle">बैंकिंग भर्ती परीक्षा</text>
</svg>`,

  // 28. GST
  'gst.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#0D47A1" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#F5F5F5"/>

  <!-- GST Tricolor Ribbon Swirl -->
  <path d="M 35 48 C 35 34 60 30 75 35 C 85 39 85 50 75 54 C 65 58 40 50 40 64 C 40 76 65 76 85 68" fill="none" stroke="#FF7A00" stroke-width="5" stroke-linecap="round"/>
  <path d="M 40 55 C 40 42 62 40 72 45 C 80 48 80 56 72 60 C 62 64 45 58 45 70 C 45 78 68 80 82 72" fill="none" stroke="#138808" stroke-width="4.5" stroke-linecap="round"/>

  <!-- GST Bold Typography -->
  <text x="60" y="66" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#0D47A1" text-anchor="middle" letter-spacing="1">GST</text>

  <!-- Banner -->
  <rect x="18" y="86" width="84" height="17" rx="8.5" fill="#0D47A1"/>
  <text x="60" y="98" font-family="Arial, sans-serif" font-size="8" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">GOODS &amp; SERVICES</text>
  <text x="60" y="22" font-family="Arial, sans-serif" font-size="6.5" font-weight="bold" fill="#0D47A1" text-anchor="middle">वस्तु एवं सेवा कर</text>
</svg>`,

  // 29. Udyam MSME
  'udyam.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#E65100" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#FFF3E0"/>

  <!-- MSME Gear & Plant Shoot -->
  <circle cx="60" cy="50" r="22" fill="#E65100"/>
  <circle cx="60" cy="50" r="15" fill="#FFFFFF"/>
  <!-- Growing Sprout -->
  <path d="M 60 62 L 60 44" stroke="#2E7D32" stroke-width="2.5"/>
  <path d="M 60 50 C 52 46 52 40 60 40 Z" fill="#4CAF50"/>
  <path d="M 60 45 C 68 41 68 35 60 35 Z" fill="#81C784"/>

  <!-- Banner -->
  <rect x="20" y="84" width="80" height="17" rx="8.5" fill="#E65100"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">UDYAM MSME</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#BF360C" text-anchor="middle">सूक्ष्म, लघु एवं मध्यम उद्यम</text>
</svg>`,

  // 30. FSSAI
  'fssai.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#388E3C" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E8F5E9"/>

  <!-- Food Bowl & Sprouting Leaves (FSSAI Logo geometry) -->
  <path d="M 38 52 C 38 68 82 68 82 52 Z" fill="#388E3C"/>
  <ellipse cx="60" cy="52" rx="22" ry="5" fill="#66BB6A"/>
  
  <!-- Tricolor Leaves rising from bowl -->
  <path d="M 52 50 C 44 42 48 30 54 36 Z" fill="#FF7A00"/>
  <path d="M 60 49 C 60 36 68 36 68 44 Z" fill="#2E7D32"/>
  <path d="M 68 50 C 76 42 72 30 66 36 Z" fill="#1565C0"/>

  <!-- Banner -->
  <rect x="22" y="84" width="76" height="17" rx="8.5" fill="#2E7D32"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">FSSAI</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#1B5E20" text-anchor="middle">खाद्य सुरक्षा एवं मानक</text>
</svg>`,

  // 31. CM Helpline 181
  'cm-helpline.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#D32F2F" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#FFEBEE"/>

  <!-- Headset / Phone receiver with 181 -->
  <path d="M 36 54 A 24 24 0 0 1 84 54 L 84 65 C 84 68 80 72 76 72" fill="none" stroke="#D32F2F" stroke-width="4.5" stroke-linecap="round"/>
  <rect x="32" y="50" width="8" height="16" rx="4" fill="#B71C1C"/>
  <rect x="80" y="50" width="8" height="16" rx="4" fill="#B71C1C"/>
  
  <text x="60" y="56" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#D32F2F" text-anchor="middle">181</text>

  <!-- Banner -->
  <rect x="16" y="84" width="88" height="17" rx="8.5" fill="#D32F2F"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">CM HELPLINE 181</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#B71C1C" text-anchor="middle">मध्य प्रदेश जन सेवा</text>
</svg>`,

  // 32. MP Police
  'police-mp.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#1A237E" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#E8EAF6"/>

  <!-- Police Shield Badge -->
  <path d="M 60 25 L 85 36 C 85 58 72 72 60 78 C 48 72 35 58 35 36 Z" fill="#1A237E" stroke="#FFB300" stroke-width="2"/>
  <!-- Star inside shield -->
  <polygon points="60,38 63,47 72,47 65,52 68,61 60,56 52,61 55,52 48,47 57,47" fill="#FFB300"/>

  <rect x="18" y="84" width="84" height="17" rx="8.5" fill="#1A237E"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">MP POLICE</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#0D47A1" text-anchor="middle">देश भक्ति - जन सेवा</text>
</svg>`,

  // 33. e-Courts
  'ecourts.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#263238" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="53" fill="#ECEFF1"/>

  <!-- Scales of Justice -->
  <g stroke="#37474F" stroke-width="2" fill="none">
    <line x1="60" y1="30" x2="60" y2="68"/>
    <line x1="38" y1="40" x2="82" y2="40"/>
    <polygon points="48,70 72,70 68,68 52,68" fill="#37474F"/>
    <!-- Left Scale Pan -->
    <line x1="38" y1="40" x2="32" y2="52"/>
    <line x1="38" y1="40" x2="44" y2="52"/>
    <path d="M 30 52 C 30 60 46 60 46 52 Z" fill="#FFB300"/>
    <!-- Right Scale Pan -->
    <line x1="82" y1="40" x2="76" y2="52"/>
    <line x1="82" y1="40" x2="88" y2="52"/>
    <path d="M 74 52 C 74 60 90 60 90 52 Z" fill="#FFB300"/>
  </g>

  <rect x="22" y="84" width="76" height="17" rx="8.5" fill="#263238"/>
  <text x="60" y="96" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">e-COURTS</text>
  <text x="60" y="111" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#37474F" text-anchor="middle">जिला एवं उच्च न्यायालय</text>
</svg>`
};

// Aliases mapping for backward compatibility and various slugs
const aliases = {
  'aadhaar.svg': 'uidai-aadhaar.svg',
  'uidai.svg': 'uidai-aadhaar.svg',
  'pan.svg': 'pan-nsdl.svg',
  'nsdl.svg': 'pan-nsdl.svg',
  'voter.svg': 'eci-voter.svg',
  'voter-id.svg': 'eci-voter.svg',
  'samagra.svg': 'samagra-mp.svg',
  'samagra-id.svg': 'samagra-mp.svg',
  'ayushman.svg': 'ayushman-pmjay.svg',
  'pmjay.svg': 'ayushman-pmjay.svg',
  'pmkisan.svg': 'pm-kisan.svg',
  'kisan.svg': 'pm-kisan.svg',
  'driving.svg': 'parivahan.svg',
  'rto.svg': 'parivahan.svg',
  'passport.svg': 'passport-seva.svg',
  'ration.svg': 'ration-nfsa.svg',
  'nfsa.svg': 'ration-nfsa.svg',
  'lokseva.svg': 'mp-lokseva.svg',
  'edistrict.svg': 'mp-lokseva.svg',
  'bhulekh.svg': 'mp-bhulekh.svg',
  'khasra.svg': 'mp-bhulekh.svg',
  'electricity.svg': 'mp-electricity.svg',
  'bijli.svg': 'mp-electricity.svg',
  'lpg.svg': 'lpg-cylinder.svg',
  'gas.svg': 'lpg-cylinder.svg',
  'birth.svg': 'crs-india.svg',
  'death.svg': 'crs-india.svg',
  'vyapam.svg': 'mpesb.svg',
  'police.svg': 'police-mp.svg',
};

// Write primary files
let count = 0;
for (const [filename, content] of Object.entries(logos)) {
  fs.writeFileSync(path.join(outDir, filename), content.trim(), 'utf8');
  count++;
}

// Write alias files
for (const [aliasName, targetFile] of Object.entries(aliases)) {
  if (logos[targetFile]) {
    fs.writeFileSync(path.join(outDir, aliasName), logos[targetFile].trim(), 'utf8');
    count++;
  }
}

console.log("Successfully generated " + count + " official SVG emblems in " + outDir);
