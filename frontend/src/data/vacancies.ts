export type Vacancy = {
  id: string;
  title: string;
  titleHi: string;
  organization: string;
  state: string;
  qualification: string;
  lastDate: string;
  totalPosts: number;
  category: string;
  applyLink: string;
  notificationPdf?: string;
  postedDate: string;
};

export const indianStates = [
  "All India", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
];

export const qualifications = [
  "All", "10th Pass", "12th Pass", "ITI", "Diploma", "Graduate", "Post Graduate", "Engineering", "Medical", "Any",
];

export const sampleVacancies: Vacancy[] = [
  {
    id: "1",
    title: "SSC CGL 2026 Recruitment",
    titleHi: "SSC CGL 2026 भर्ती",
    organization: "Staff Selection Commission",
    state: "All India",
    qualification: "Graduate",
    lastDate: "2026-08-15",
    totalPosts: 17727,
    category: "SSC",
    applyLink: "https://ssc.gov.in",
    postedDate: "2026-07-01",
  },
  {
    id: "2",
    title: "RRB NTPC Level 2 Recruitment",
    titleHi: "RRB NTPC स्तर 2 भर्ती",
    organization: "Railway Recruitment Board",
    state: "All India",
    qualification: "12th Pass",
    lastDate: "2026-08-30",
    totalPosts: 11588,
    category: "Railway",
    applyLink: "https://rrbcdg.gov.in",
    postedDate: "2026-07-10",
  },
  {
    id: "3",
    title: "UPSC Civil Services 2026",
    titleHi: "UPSC सिविल सेवा 2026",
    organization: "Union Public Service Commission",
    state: "All India",
    qualification: "Graduate",
    lastDate: "2026-06-20",
    totalPosts: 1056,
    category: "UPSC",
    applyLink: "https://upsc.gov.in",
    postedDate: "2026-02-01",
  },
  {
    id: "4",
    title: "MP Police Constable Recruitment",
    titleHi: "MP पुलिस कांस्टेबल भर्ती",
    organization: "Madhya Pradesh Police",
    state: "Madhya Pradesh",
    qualification: "12th Pass",
    lastDate: "2026-09-01",
    totalPosts: 7500,
    category: "Police",
    applyLink: "https://mppolice.gov.in",
    postedDate: "2026-07-15",
  },
  {
    id: "5",
    title: "SBI PO Recruitment 2026",
    titleHi: "SBI PO भर्ती 2026",
    organization: "State Bank of India",
    state: "All India",
    qualification: "Graduate",
    lastDate: "2026-08-10",
    totalPosts: 2000,
    category: "Bank",
    applyLink: "https://sbi.co.in",
    postedDate: "2026-07-05",
  },
];
