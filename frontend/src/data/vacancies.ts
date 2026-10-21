export interface PostDetail {
  postName: string;
  postNameHi?: string;
  vacanciesCount: number;
  qualification?: string;
  ageLimit?: string;
  salary?: string;
  categoryBreakdown?: {
    ur?: number;
    ews?: number;
    obc?: number;
    sc?: number;
    st?: number;
    female?: number;
    pwd?: number;
  };
}

export interface DocumentChecklistItem {
  documentName: string;
  documentNameHi?: string;
  requirementType: 'mandatory' | 'conditional' | 'optional';
  stage: 'application' | 'examination' | 'document_verification';
  allowedFormats?: string[];
  maxSizeKB?: number;
  dimensions?: string;
  notificationReference?: string;
}

export interface SelectionStage {
  stageNumber: number;
  title: string;
  titleHi?: string;
  description: string;
}

export interface FeeStructure {
  isUnknown?: boolean;
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  female?: number;
  pwd?: number;
  portalCharges?: number;
  exemptions?: string[];
  note?: string;
}

export interface Vacancy {
  id: string;
  slug: string;
  title: string;
  titleHi: string;
  department: string;
  departmentHi?: string;
  organization: string;
  organizationHi?: string;
  recruitingAuthority?: string;
  advertisementNumber?: string;
  recruitmentYear?: string;
  locationScope?: 'MP' | 'All India' | 'State' | 'District';
  state: string;
  category: string;
  employmentType?: string;
  applicationMode?: 'online' | 'offline' | 'both';
  totalPosts: number;
  salary?: string;
  qualification: string;
  qualificationLevel?: string;
  qualificationTags?: string[];
  ageMinimum?: number;
  ageMaximum?: number;
  ageCalculationDate?: string;
  ageRelaxation?: string;
  domicileRequirement?: string;
  physicalRequirements?: string;
  startDate?: string;
  lastDate: string;
  feeLastDate?: string;
  correctionDate?: string;
  correctionEndDate?: string;
  examDate?: string;
  examDateNote?: string;
  citySlipDate?: string;
  admitCardDate?: string;
  answerKeyDate?: string;
  resultDate?: string;
  status: 'active' | 'closing_soon' | 'upcoming' | 'closed' | 'archived' | 'cancelled';
  dynamicStatus?: string;
  isFeeExempt?: boolean;
  feeDetails?: FeeStructure;
  pdsAssistance?: {
    isAvailable: boolean;
    fee: number;
    notes?: string;
  };
  documentChecklist?: DocumentChecklistItem[];
  selectionProcess?: SelectionStage[];
  applicationInstructions?: string;
  applicationInstructionsHi?: string;
  offlineFormDetails?: {
    formPdfUrl?: string;
    submissionAddress?: string;
    deadlineType?: 'dispatch' | 'receipt';
  };
  officialWebsiteUrl?: string;
  applyUrl?: string;
  applyLink?: string; // Legacy alias
  notificationPdf?: string;
  syllabusUrl?: string;
  admitCardUrl?: string;
  answerKeyUrl?: string;
  resultUrl?: string;
  scorecardUrl?: string;
  meritListUrl?: string;
  postedDate?: string;
  type?: string;
  isFeatured?: boolean;
}

export const indianStates = [
  "All India", "Madhya Pradesh", "Uttar Pradesh", "Bihar", "Rajasthan", "Delhi",
  "Chhattisgarh", "Haryana", "Maharashtra", "Jharkhand", "Gujarat", "Punjab",
  "Uttarakhand", "Himachal Pradesh", "West Bengal", "Odisha", "Assam", "Andhra Pradesh",
  "Karnataka", "Tamil Nadu", "Kerala", "Telangana"
];

export const qualifications = [
  "All", "8th Pass", "10th Pass", "12th Pass", "ITI", "Diploma", "Graduate", "Postgraduate", "Engineering", "Medical"
];

export const recruitmentAuthorities = [
  "All Authorities", "MPESB", "MPPSC", "MP Police", "MP High Court", "NHM MP",
  "SSC", "UPSC", "RRB", "SBI", "India Post", "WCD MP"
];

export const sampleVacancies: Vacancy[] = [
  {
    id: "mpesb-sub-eng-2026",
    slug: "mpesb-group-3-sub-engineer-recruitment-2026",
    title: "MPESB Sub Engineer, Draftsman & Other Group-3 Combined Recruitment 2026",
    titleHi: "एमपीईएसबी उप अभियंता, मानचित्रकार एवं अन्य पद समूह-3 संयुक्त भर्ती 2026",
    organization: "MPESB Bhopal",
    organizationHi: "एमपीईएसबी, भोपाल",
    department: "Madhya Pradesh Employees Selection Board (MPESB)",
    departmentHi: "मध्य प्रदेश कर्मचारी चयन मंडल (MPESB / व्यापम)",
    recruitingAuthority: "MPESB",
    advertisementNumber: "MPESB/2026/GRP3/01",
    recruitmentYear: "2026",
    locationScope: "MP",
    state: "Madhya Pradesh",
    qualification: "Diploma / Degree in Civil / Electrical / Mechanical Engineering",
    qualificationLevel: "Diploma",
    qualificationTags: ["Diploma", "B.E.", "B.Tech", "Engineering"],
    lastDate: "2026-05-15",
    startDate: "2026-03-01",
    feeLastDate: "2026-05-15",
    examDate: "2026-06-25",
    totalPosts: 892,
    category: "engineering",
    employmentType: "regular",
    applicationMode: "online",
    salary: "₹32,800 - ₹1,03,600 (Level 8)",
    status: "active",
    dynamicStatus: "active",
    ageMinimum: 18,
    ageMaximum: 40,
    ageRelaxation: "5 Years relaxation for SC/ST/OBC and Women candidates of MP domicile",
    domicileRequirement: "Must have valid MP Rojgar Panjiyan & MP Domicile",
    feeDetails: {
      isUnknown: false,
      general: 500,
      obc: 250,
      ews: 250,
      sc: 250,
      st: 250,
      female: 250,
      pwd: 250,
      portalCharges: 60,
      note: "Unreserved ₹500 + ₹60 portal charge. MP SC/ST/OBC ₹250 + ₹60 portal charge."
    },
    pdsAssistance: {
      isAvailable: true,
      fee: 60,
      notes: "MP Rojgar renewal, Vyapam profile creation, photo-signature resizing & receipt printout."
    },
    documentChecklist: [
      { documentName: "MP Rojgar Panjiyan", documentNameHi: "एमपी रोजगार पंजीयन", requirementType: "mandatory", stage: "application", allowedFormats: ["PDF"], maxSizeKB: 200 },
      { documentName: "MPESB Profile Template with Photo & Sign", documentNameHi: "व्यापम प्रोफाइल टेम्पलेट", requirementType: "mandatory", stage: "application", allowedFormats: ["JPG"], maxSizeKB: 200 },
      { documentName: "Engineering Diploma / Degree Marksheet", documentNameHi: "डिप्लोमा / डिग्री अंकसूची", requirementType: "mandatory", stage: "application", allowedFormats: ["PDF"], maxSizeKB: 300 }
    ],
    selectionProcess: [
      { stageNumber: 1, title: "Online CBT Examination (200 Marks)", titleHi: "ऑनलाइन लिखित परीक्षा", description: "100 Non-Technical (GK, Hindi, English, Maths, Reasoning, Science, Computer) + 100 Technical Core Questions." },
      { stageNumber: 2, title: "Document Verification", titleHi: "दस्तावेज़ सत्यापन", description: "Verification of educational and domicile credentials at Bhopal." }
    ],
    officialWebsiteUrl: "https://esb.mp.gov.in",
    applyUrl: "https://esb.mponline.gov.in",
    applyLink: "https://esb.mponline.gov.in",
    notificationPdf: "https://esb.mp.gov.in/Rulebooks/RB_2026/Group3_SubEngineer_Rulebook.pdf",
    syllabusUrl: "https://esb.mp.gov.in/Syllabus/Group3_2026.pdf",
    postedDate: "2026-03-01",
    type: "government"
  },
  {
    id: "mppsc-sse-2026",
    slug: "mppsc-state-service-examination-2026",
    title: "MPPSC State Service Examination (SSE) 2026",
    titleHi: "एमपीपीएससी राज्य सेवा परीक्षा 2026",
    organization: "MPPSC Indore",
    organizationHi: "एमपीपीएससी, इंदौर",
    department: "Madhya Pradesh Public Service Commission (MPPSC)",
    departmentHi: "मध्य प्रदेश लोक सेवा आयोग (MPPSC)",
    recruitingAuthority: "MPPSC",
    advertisementNumber: "01/EXAM/2026",
    recruitmentYear: "2026",
    locationScope: "MP",
    state: "Madhya Pradesh",
    qualification: "Bachelor Degree in any discipline from a recognized University",
    qualificationLevel: "Graduate",
    qualificationTags: ["Graduate", "B.A.", "B.Com", "B.Sc.", "B.Tech"],
    lastDate: "2026-04-28",
    startDate: "2026-01-19",
    feeLastDate: "2026-04-28",
    examDate: "2026-06-21",
    admitCardDate: "2026-06-12",
    totalPosts: 235,
    category: "government",
    employmentType: "regular",
    applicationMode: "online",
    salary: "₹56,100 - ₹1,77,500 (Pay Level 12 / 10)",
    status: "active",
    dynamicStatus: "active",
    ageMinimum: 21,
    ageMaximum: 40,
    ageRelaxation: "5 Years for SC/ST/OBC and Women candidates of MP",
    domicileRequirement: "Open to all Indian citizens; quota reserved for MP domicile",
    feeDetails: {
      isUnknown: false,
      general: 500,
      obc: 250,
      ews: 250,
      sc: 250,
      st: 250,
      female: 250,
      pwd: 250,
      portalCharges: 40,
      note: "MP SC/ST/OBC ₹250 + ₹40 portal charges. All others and out-of-state candidates ₹500 + ₹40."
    },
    pdsAssistance: {
      isAvailable: true,
      fee: 80,
      notes: "OTR form checking, service preference selection, and guaranteed submission receipt."
    },
    documentChecklist: [
      { documentName: "MP Rojgar Registration Slip", documentNameHi: "एमपी रोजगार पंजीयन पर्ची", requirementType: "mandatory", stage: "application", allowedFormats: ["PDF"], maxSizeKB: 200 },
      { documentName: "Graduation Marksheet / Degree", documentNameHi: "स्नातक अंकसूची", requirementType: "mandatory", stage: "application", allowedFormats: ["PDF"], maxSizeKB: 300 },
      { documentName: "Recent Color Passport Photograph", documentNameHi: "पासपोर्ट आकार फोटो", requirementType: "mandatory", stage: "application", allowedFormats: ["JPG"], maxSizeKB: 100 }
    ],
    selectionProcess: [
      { stageNumber: 1, title: "Preliminary Examination", titleHi: "प्रारंभिक परीक्षा (Objective)", description: "GS Paper 1 (200 marks) + CSAT Paper 2 (200 marks)." },
      { stageNumber: 2, title: "Main Written Examination", titleHi: "मुख्य परीक्षा (Descriptive)", description: "6 subjective papers totaling 1400 marks." },
      { stageNumber: 3, title: "Interview / Personality Test", titleHi: "साक्षात्कार (175 अंक)", description: "Conducted at MPPSC head office Indore." }
    ],
    officialWebsiteUrl: "https://mppsc.mp.gov.in",
    applyUrl: "https://mppsc.mp.gov.in",
    applyLink: "https://mppsc.mp.gov.in",
    notificationPdf: "https://mppsc.mp.gov.in/uploads/files/SSE_2026_Advt.pdf",
    syllabusUrl: "https://mppsc.mp.gov.in/uploads/files/MPPSC_Syllabus_Revised.pdf",
    postedDate: "2026-01-19",
    type: "government"
  },
  {
    id: "mp-police-constable-2026",
    slug: "mp-police-constable-gd-radio-recruitment-2026",
    title: "MP Police Constable (GD & Radio) Recruitment 2026",
    titleHi: "मध्य प्रदेश पुलिस आरक्षक (जीडी व रेडियो) भर्ती 2026",
    organization: "MP Police / MPESB",
    organizationHi: "एमपी पुलिस / एमपीईएसबी",
    department: "Madhya Pradesh Police Headquarters, Bhopal",
    departmentHi: "मध्य प्रदेश पुलिस मुख्यालय, भोपाल",
    recruitingAuthority: "MPESB",
    advertisementNumber: "PHQ/CONST/2026/02",
    recruitmentYear: "2026",
    locationScope: "MP",
    state: "Madhya Pradesh",
    qualification: "10th / 12th Pass (8th Pass for ST). ITI/Diploma for Radio",
    qualificationLevel: "10th",
    qualificationTags: ["10th", "12th", "ITI", "Police"],
    lastDate: "2026-05-10",
    startDate: "2026-03-10",
    feeLastDate: "2026-05-10",
    examDate: "2026-07-15",
    totalPosts: 7500,
    category: "police",
    employmentType: "regular",
    applicationMode: "online",
    salary: "₹19,500 - ₹62,000 (Level 4)",
    status: "active",
    dynamicStatus: "active",
    ageMinimum: 18,
    ageMaximum: 36,
    feeDetails: {
      isUnknown: false,
      general: 500,
      obc: 250,
      ews: 250,
      sc: 250,
      st: 250,
      female: 250,
      pwd: 0,
      portalCharges: 60,
      note: "General ₹500 + ₹60 portal. Reserved categories ₹250 + ₹60."
    },
    pdsAssistance: {
      isAvailable: true,
      fee: 60,
      notes: "Complete form assistance with photo-name-date standard compliance."
    },
    documentChecklist: [
      { documentName: "10th Class Marksheet", documentNameHi: "10वीं अंकसूची", requirementType: "mandatory", stage: "application", allowedFormats: ["JPG"], maxSizeKB: 200 },
      { documentName: "MP Rojgar Registration Slip", documentNameHi: "रोजगार पंजीयन रसीद", requirementType: "mandatory", stage: "application", allowedFormats: ["PDF"], maxSizeKB: 200 }
    ],
    selectionProcess: [
      { stageNumber: 1, title: "Computer Based Test (CBT)", titleHi: "ऑनलाइन लिखित परीक्षा (100 अंक)", description: "GK, Reasoning, Elementary Maths." },
      { stageNumber: 2, title: "Physical Efficiency Test (PET)", titleHi: "शारीरिक दक्षता परीक्षा (PET)", description: "Running, Shot-put, and Long Jump." }
    ],
    officialWebsiteUrl: "https://esb.mp.gov.in",
    applyUrl: "https://esb.mponline.gov.in",
    applyLink: "https://esb.mponline.gov.in",
    notificationPdf: "https://esb.mp.gov.in/Rulebooks/RB_2026/MP_Police_Constable_2026.pdf",
    postedDate: "2026-03-10",
    type: "government"
  },
  {
    id: "ssc-cgl-2026",
    slug: "ssc-combined-graduate-level-cgl-exam-2026",
    title: "SSC Combined Graduate Level (CGL) Examination 2026",
    titleHi: "एसएससी संयुक्त स्नातक स्तरीय परीक्षा (CGL) 2026",
    organization: "Staff Selection Commission",
    organizationHi: "कर्मचारी चयन आयोग",
    department: "Staff Selection Commission (SSC)",
    departmentHi: "कर्मचारी चयन आयोग (SSC), भारत सरकार",
    recruitingAuthority: "SSC",
    advertisementNumber: "HQ-PPII03(2)/2026-PP_II",
    recruitmentYear: "2026",
    locationScope: "All India",
    state: "All India",
    qualification: "Bachelor Degree in any discipline from a recognized University",
    qualificationLevel: "Graduate",
    qualificationTags: ["Graduate", "B.A.", "B.Com", "B.Sc.", "B.Tech", "Central Govt"],
    lastDate: "2026-05-24",
    startDate: "2026-03-24",
    feeLastDate: "2026-05-25",
    examDate: "2026-09-10",
    totalPosts: 14250,
    category: "government",
    employmentType: "regular",
    applicationMode: "online",
    salary: "₹35,400 to ₹1,42,400 (Level 4 to Level 7)",
    status: "active",
    dynamicStatus: "active",
    ageMinimum: 18,
    ageMaximum: 32,
    feeDetails: {
      isUnknown: false,
      general: 100,
      obc: 100,
      ews: 100,
      sc: 0,
      st: 0,
      female: 0,
      pwd: 0,
      portalCharges: 0,
      exemptions: ["Female candidates, SC, ST, and PwD applicants are officially 100% fee-exempt."],
      note: "Fee ₹100 for UR/OBC Male. 100% Free for all women and SC/ST/PwD candidates."
    },
    pdsAssistance: {
      isAvailable: true,
      fee: 50,
      notes: "SSC new portal live photo capture, post preference entry, and fee payment verification."
    },
    documentChecklist: [
      { documentName: "SSC OTR (One Time Registration)", documentNameHi: "एसएससी ओटीआर पंजीयन", requirementType: "mandatory", stage: "application", allowedFormats: ["Text"] },
      { documentName: "Live Webcam Photograph", documentNameHi: "लाइव वेबकैम फोटो", requirementType: "mandatory", stage: "application", allowedFormats: ["Live Camera"] },
      { documentName: "Scanned Signature", documentNameHi: "हस्ताक्षर", requirementType: "mandatory", stage: "application", allowedFormats: ["JPG"], maxSizeKB: 20 }
    ],
    selectionProcess: [
      { stageNumber: 1, title: "Tier-1 Computer Based Examination", titleHi: "टियर-1 ऑनलाइन परीक्षा (Qualifying)", description: "100 Questions (200 Marks) across Reasoning, GA, Quant, English." },
      { stageNumber: 2, title: "Tier-2 Computer Based Examination", titleHi: "टियर-2 मुख्य परीक्षा", description: "Comprehensive paper with Maths, Reasoning, English, GA, Computer + DEST Typing." }
    ],
    officialWebsiteUrl: "https://ssc.gov.in",
    applyUrl: "https://ssc.gov.in",
    applyLink: "https://ssc.gov.in",
    notificationPdf: "https://ssc.gov.in/api/announcement/notice_cgl_2026.pdf",
    syllabusUrl: "https://ssc.gov.in/syllabus/cgl_2026.pdf",
    postedDate: "2026-03-24",
    type: "government"
  },
  {
    id: "rrb-alp-2026",
    slug: "rrb-alp-technician-centralized-recruitment-2026",
    title: "Railway RRB Assistant Loco Pilot (ALP) & Technician 2026",
    titleHi: "रेलवे भर्ती बोर्ड (RRB) सहायक लोको पायलट (ALP) व तकनीशियन भर्ती 2026",
    organization: "Railway Recruitment Boards",
    organizationHi: "रेलवे भर्ती बोर्ड",
    department: "Ministry of Railways, Government of India",
    departmentHi: "रेल मंत्रालय, भारत सरकार",
    recruitingAuthority: "RRB",
    advertisementNumber: "CEN 01/2026",
    recruitmentYear: "2026",
    locationScope: "All India",
    state: "All India",
    qualification: "10th + ITI in specified trade OR Diploma in Mechanical / Electrical Engineering",
    qualificationLevel: "ITI",
    qualificationTags: ["10th", "ITI", "Diploma", "Railway", "ALP"],
    lastDate: "2026-04-18",
    startDate: "2026-02-15",
    feeLastDate: "2026-04-18",
    examDate: "2026-07-20",
    totalPosts: 18799,
    category: "railway",
    employmentType: "regular",
    applicationMode: "online",
    salary: "₹19,900 (Level 2) + Running Allowances (approx ₹38,000)",
    status: "closing_soon",
    dynamicStatus: "closing_soon",
    ageMinimum: 18,
    ageMaximum: 33,
    feeDetails: {
      isUnknown: false,
      general: 500,
      obc: 500,
      ews: 500,
      sc: 250,
      st: 250,
      female: 250,
      pwd: 250,
      portalCharges: 0,
      exemptions: ["₹400 refunded to General/OBC and ₹250 refunded to SC/ST/Female on appearing in CBT-1."],
      note: "₹500 for General/OBC (₹400 refundable). ₹250 for SC/ST/Female (fully refundable)."
    },
    pdsAssistance: {
      isAvailable: true,
      fee: 60,
      notes: "Bank account refund details accuracy, ITI trade certificate matching, and zone selection."
    },
    documentChecklist: [
      { documentName: "10th Passing Certificate", documentNameHi: "10वीं अंकसूची", requirementType: "mandatory", stage: "application", allowedFormats: ["PDF"], maxSizeKB: 300 },
      { documentName: "ITI Certificate or Engineering Diploma", documentNameHi: "आईटीआई या इंजीनियरिंग डिप्लोमा", requirementType: "mandatory", stage: "application", allowedFormats: ["PDF"], maxSizeKB: 300 }
    ],
    selectionProcess: [
      { stageNumber: 1, title: "CBT-1 Screening Exam", titleHi: "प्रथम चरण सीबीटी (75 प्रश्न)", description: "Maths, Mental Ability, General Science, General Awareness." },
      { stageNumber: 2, title: "CBT-2 Merit & Trade Test", titleHi: "द्वितीय चरण सीबीटी", description: "Part A (100 Marks Merit) + Part B (Qualifying Trade Test)." },
      { stageNumber: 3, title: "Computer Based Aptitude Test (CBAT)", titleHi: "मनोवैज्ञानिक साइको टेस्ट", description: "Qualifying battery for ALP posts." }
    ],
    officialWebsiteUrl: "https://www.rrbapply.gov.in",
    applyUrl: "https://www.rrbapply.gov.in",
    applyLink: "https://www.rrbapply.gov.in",
    notificationPdf: "https://www.rrbcdg.gov.in/uploads/CEN_01_2026_ALP.pdf",
    postedDate: "2026-02-15",
    type: "government"
  },
  {
    id: "india-post-gds-2026",
    slug: "india-post-gds-recruitment-2026",
    title: "India Post Gramin Dak Sevak (GDS, BPM, ABPM) Recruitment 2026",
    titleHi: "भारतीय डाक ग्रामीण डाक सेवक (GDS) भर्ती 2026",
    organization: "India Post",
    organizationHi: "भारतीय डाक विभाग",
    department: "Department of Posts, Ministry of Communications",
    departmentHi: "डाक विभाग, भारत सरकार",
    recruitingAuthority: "India Post",
    advertisementNumber: "GDS/ONLINE/2026/01",
    recruitmentYear: "2026",
    locationScope: "All India",
    state: "Madhya Pradesh & All India",
    qualification: "10th Class passed with Mathematics and English from any recognized Board",
    qualificationLevel: "10th",
    qualificationTags: ["10th", "No Exam", "Merit Based", "Post Office", "GDS"],
    lastDate: "2026-05-15",
    startDate: "2026-03-20",
    resultDate: "2026-06-15",
    totalPosts: 44228,
    category: "government",
    employmentType: "regular",
    applicationMode: "online",
    salary: "₹12,000 - ₹29,380 (TRCA Slab)",
    status: "active",
    dynamicStatus: "active",
    ageMinimum: 18,
    ageMaximum: 40,
    feeDetails: {
      isUnknown: false,
      general: 100,
      obc: 100,
      ews: 100,
      sc: 0,
      st: 0,
      female: 0,
      pwd: 0,
      portalCharges: 0,
      exemptions: ["All female candidates, SC/ST, PwD, and Transwomen are officially 100% fee-exempt."],
      note: "Fee ₹100 for UR/OBC Male. 100% Free for all Female and SC/ST candidates."
    },
    pdsAssistance: {
      isAvailable: true,
      fee: 50,
      notes: "Division and post office preference selection guidance to maximize merit chances."
    },
    documentChecklist: [
      { documentName: "10th Marksheet", documentNameHi: "10वीं अंकसूची", requirementType: "mandatory", stage: "application", allowedFormats: ["JPG"], maxSizeKB: 100 },
      { documentName: "Passport Size Photograph", documentNameHi: "फोटो", requirementType: "mandatory", stage: "application", allowedFormats: ["JPG"], maxSizeKB: 50 }
    ],
    selectionProcess: [
      { stageNumber: 1, title: "10th Class Merit List (No Exam)", titleHi: "10वीं मेरिट सूची (परीक्षा मुक्त)", description: "Direct merit list calculated strictly based on 10th standard percentages." },
      { stageNumber: 2, title: "Document Verification", titleHi: "दस्तावेज़ सत्यापन", description: "Verification at designated Postal Division Superintendent Office." }
    ],
    officialWebsiteUrl: "https://indiapostgdsonline.gov.in",
    applyUrl: "https://indiapostgdsonline.gov.in",
    applyLink: "https://indiapostgdsonline.gov.in",
    notificationPdf: "https://indiapostgdsonline.gov.in/notifications/GDS_ONLINE_ENG_2026.pdf",
    postedDate: "2026-03-20",
    type: "government"
  },
  {
    id: "mp-anganwadi-2026",
    slug: "mp-anganwadi-worker-assistant-recruitment-2026",
    title: "MP Anganwadi Worker & Assistant Recruitment 2026 (District Offline)",
    titleHi: "मध्य प्रदेश आंगनवाड़ी कार्यकर्ता एवं सहायिका भर्ती 2026 (ऑफलाइन)",
    organization: "Collector & District Programme Officer (WCD)",
    organizationHi: "जिला कलेक्टर कार्यालय (महिला एवं बाल विकास)",
    department: "Department of Women and Child Development, Madhya Pradesh",
    departmentHi: "महिला एवं बाल विकास विभाग, मध्य प्रदेश",
    recruitingAuthority: "WCD District Offices",
    advertisementNumber: "WCD/ANG/2026/DIST",
    recruitmentYear: "2026",
    locationScope: "MP",
    state: "Madhya Pradesh",
    qualification: "Worker: 12th Pass. Assistant: 10th Pass. Only female resident of concerned village/ward.",
    qualificationLevel: "12th",
    qualificationTags: ["10th", "12th", "Female", "Anganwadi", "Offline Form"],
    lastDate: "2026-04-30",
    startDate: "2026-03-01",
    totalPosts: 3820,
    category: "government",
    employmentType: "contract",
    applicationMode: "offline",
    salary: "₹13,000 (Worker) / ₹6,500 (Helper) Monthly Honorarium",
    status: "active",
    dynamicStatus: "active",
    isFeeExempt: true,
    ageMinimum: 18,
    ageMaximum: 45,
    feeDetails: {
      isUnknown: false,
      general: 0,
      obc: 0,
      ews: 0,
      sc: 0,
      st: 0,
      female: 0,
      pwd: 0,
      exemptions: ["Official application is 100% free of government fees."],
      note: "No government fee charged."
    },
    pdsAssistance: {
      isAvailable: true,
      fee: 40,
      notes: "PDS provides official prescribed form printout, document verification checklist, and CDPO office filing support."
    },
    offlineFormDetails: {
      formPdfUrl: "https://mpwcdmis.gov.in/Downloads/Anganwadi_Application_Format.pdf",
      submissionAddress: "Concerned CDPO Office of your Tehsil/Block.",
      deadlineType: "receipt"
    },
    documentChecklist: [
      { documentName: "10th / 12th Marksheet Copy", documentNameHi: "10वीं / 12वीं अंकसूची प्रति", requirementType: "mandatory", stage: "application", allowedFormats: ["Physical Copy"] },
      { documentName: "Resident Proof (Samagra ID / Voter Card)", documentNameHi: "वार्ड / ग्राम निवासी प्रमाण पत्र", requirementType: "mandatory", stage: "application", allowedFormats: ["Physical Copy"] }
    ],
    selectionProcess: [
      { stageNumber: 1, title: "Merit Score Calculation", titleHi: "मेरिट अंक निर्धारण", description: "Merit based on educational qualifications + BPL/widow bonus points." },
      { stageNumber: 2, title: "Claims & Objections Window", titleHi: "दावा आपत्ति", description: "7 days public notice board objection window." }
    ],
    officialWebsiteUrl: "https://mpwcdmis.gov.in",
    notificationPdf: "https://mpwcdmis.gov.in/Downloads/Anganwadi_Guideline_2026.pdf",
    postedDate: "2026-03-01",
    type: "government"
  },
  {
    id: "mp-high-court-jja-2026",
    slug: "mp-high-court-junior-judicial-assistant-recruitment-2026",
    title: "MP High Court Junior Judicial Assistant (JJA) Recruitment 2026",
    titleHi: "मध्य प्रदेश उच्च न्यायालय कनिष्ठ न्यायिक सहायक भर्ती 2026",
    organization: "MP High Court Jabalpur",
    organizationHi: "मध्य प्रदेश उच्च न्यायालय, जबलपुर",
    department: "High Court of Madhya Pradesh",
    departmentHi: "मध्य प्रदेश उच्च न्यायालय",
    recruitingAuthority: "MP High Court",
    advertisementNumber: "MPHCC/JJA/2026/04",
    recruitmentYear: "2026",
    locationScope: "MP",
    state: "Madhya Pradesh",
    qualification: "Graduate with CPCT Scorecard (Hindi Typing) & 1 Year Computer Diploma",
    qualificationLevel: "Graduate",
    qualificationTags: ["Graduate", "CPCT", "Typing", "Computer Diploma"],
    lastDate: "2026-04-20",
    startDate: "2026-03-05",
    examDate: "2026-06-05",
    totalPosts: 384,
    category: "judiciary",
    employmentType: "regular",
    applicationMode: "online",
    salary: "₹19,500 - ₹62,000 (Pay Level 4)",
    status: "closing_soon",
    dynamicStatus: "closing_soon",
    ageMinimum: 18,
    ageMaximum: 35,
    feeDetails: {
      isUnknown: false,
      general: 777,
      obc: 577,
      ews: 777,
      sc: 577,
      st: 577,
      female: 577,
      pwd: 577,
      portalCharges: 0,
      note: "Fee inclusive of examination and portal charges."
    },
    pdsAssistance: {
      isAvailable: true,
      fee: 70,
      notes: "CPCT scorecard verification and application submission."
    },
    documentChecklist: [
      { documentName: "MP CPCT Scorecard", documentNameHi: "सीपीसीटी स्कोरकार्ड", requirementType: "mandatory", stage: "application", allowedFormats: ["PDF"], maxSizeKB: 300 },
      { documentName: "Graduation Degree", documentNameHi: "स्नातक डिग्री", requirementType: "mandatory", stage: "application", allowedFormats: ["PDF"], maxSizeKB: 300 }
    ],
    selectionProcess: [
      { stageNumber: 1, title: "Online Preliminary Screening Test", titleHi: "प्रारंभिक स्क्रीनिंग परीक्षा", description: "English, Computer Knowledge, General Knowledge." },
      { stageNumber: 2, title: "Hindi Typing Skill Test", titleHi: "हिंदी टाइपिंग दक्षता परीक्षा", description: "30 WPM Remington Gail typing test." }
    ],
    officialWebsiteUrl: "https://mphc.gov.in",
    applyUrl: "https://mphc.gov.in/recruitment-result",
    applyLink: "https://mphc.gov.in/recruitment-result",
    notificationPdf: "https://mphc.gov.in/pdf/JJA_Recruitment_2026.pdf",
    postedDate: "2026-03-05",
    type: "government"
  },
  {
    id: "mp-patwari-archive",
    slug: "mpesb-patwari-group-2-subgroup-4-combined-recruitment-archive",
    title: "MPESB Patwari & Group-2 Sub-Group-4 Combined Recruitment (Archive)",
    titleHi: "एमपीईएसबी पटवारी एवं समूह-2 उपसमूह-4 संयुक्त भर्ती परीक्षा (अभिलेख)",
    organization: "Land Records / MPESB",
    organizationHi: "भू-अभिलेख ग्वालियर / एमपीईएसबी",
    department: "Revenue Department, Madhya Pradesh",
    departmentHi: "राजस्व विभाग, मध्य प्रदेश",
    recruitingAuthority: "MPESB",
    advertisementNumber: "MPESB/PATWARI/2024",
    recruitmentYear: "2024",
    locationScope: "MP",
    state: "Madhya Pradesh",
    qualification: "Graduate in any discipline + CPCT",
    qualificationLevel: "Graduate",
    qualificationTags: ["Graduate", "Patwari", "Revenue"],
    lastDate: "2024-01-23",
    startDate: "2024-01-05",
    examDate: "2024-03-15",
    resultDate: "2024-06-30",
    totalPosts: 9073,
    category: "government",
    employmentType: "regular",
    applicationMode: "online",
    salary: "₹25,300 - ₹80,500 (Level 6)",
    status: "archived",
    dynamicStatus: "archived",
    feeDetails: {
      isUnknown: false,
      general: 500,
      obc: 250,
      sc: 250,
      st: 250,
      portalCharges: 60,
      note: "Recruitment cycle concluded."
    },
    pdsAssistance: {
      isAvailable: false,
      fee: 0,
      notes: "This recruitment cycle is closed and archived."
    },
    selectionProcess: [
      { stageNumber: 1, title: "Written Examination", titleHi: "लिखित परीक्षा", description: "200 Marks examination." }
    ],
    officialWebsiteUrl: "https://esb.mp.gov.in",
    resultUrl: "https://esb.mp.gov.in/results/RESULT_2024/PATWARI_RES.HTM",
    scorecardUrl: "https://esb.mp.gov.in/results/RESULT_2024/PATWARI_RES.HTM",
    meritListUrl: "https://esb.mp.gov.in/results/RESULT_2024/PATWARI_MERIT.PDF",
    notificationPdf: "https://esb.mp.gov.in/Rulebooks/RB_2023/Patwari_RuleBook.pdf",
    postedDate: "2024-01-05",
    type: "government"
  }
];
