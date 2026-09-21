export type ServiceItem = {
  id: string;
  name: string;
  nameHi: string;
  slug: string;
  description: string;
  descriptionHi: string;
  price?: string;
  officialPortal?: string;
  popular?: boolean;
};

export type ServiceCategory = {
  id: string;
  name: string;
  nameHi: string;
  slug: string;
  icon: string;
  description: string;
  descriptionHi: string;
  services: ServiceItem[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "identity",
    name: "Identity Services",
    nameHi: "पहचान सेवाएं",
    slug: "identity-services",
    icon: "IdCard",
    description: "Aadhaar, PAN, Driving Licence & more",
    descriptionHi: "आधार, पैन, ड्राइविंग लाइसेंस और अधिक",
    services: [
      { id: "aadhaar", name: "Aadhaar Card", nameHi: "आधार कार्ड", slug: "aadhaar-card", description: "Aadhaar enrollment and services", descriptionHi: "आधार नामांकन और सेवाएं", officialPortal: "https://uidai.gov.in", popular: true },
      { id: "pvc-aadhaar", name: "PVC Aadhaar", nameHi: "PVC आधार", slug: "pvc-aadhaar", description: "Order PVC Aadhaar card", descriptionHi: "PVC आधार कार्ड ऑर्डर करें", officialPortal: "https://uidai.gov.in", popular: true },
      { id: "aadhaar-update", name: "Aadhaar Update", nameHi: "आधार अपडेट", slug: "aadhaar-update", description: "Update Aadhaar details", descriptionHi: "आधार विवरण अपडेट करें", officialPortal: "https://uidai.gov.in" },
      { id: "pan", name: "PAN Card", nameHi: "पैन कार्ड", slug: "pan-card", description: "Apply for PAN card", descriptionHi: "पैन कार्ड के लिए आवेदन", officialPortal: "https://www.incometax.gov.in", popular: true },
      { id: "instant-pan", name: "Instant PAN", nameHi: "तत्काल PAN", slug: "instant-pan", description: "Get instant e-PAN", descriptionHi: "तत्काल e-PAN प्राप्त करें", officialPortal: "https://www.incometax.gov.in" },
      { id: "driving-licence", name: "Driving Licence", nameHi: "ड्राइविंग लाइसेंस", slug: "driving-licence", description: "Apply for driving licence", descriptionHi: "ड्राइविंग लाइसेंस के लिए आवेदन", officialPortal: "https://parivahan.gov.in" },
      { id: "learning-licence", name: "Learning Licence", nameHi: "लर्निंग लाइसेंस", slug: "learning-licence", description: "Apply for learning licence", descriptionHi: "लर्निंग लाइसेंस के लिए आवेदन", officialPortal: "https://parivahan.gov.in" },
      { id: "vehicle-rc", name: "Vehicle RC", nameHi: "वाहन RC", slug: "vehicle-rc", description: "Vehicle registration certificate", descriptionHi: "वाहन पंजीकरण प्रमाणपत्र", officialPortal: "https://parivahan.gov.in" },
      { id: "voter-id", name: "Voter ID", nameHi: "मतदाता पहचान पत्र", slug: "voter-id", description: "Apply for voter ID card", descriptionHi: "मतदाता पहचान पत्र के लिए आवेदन", officialPortal: "https://voters.eci.gov.in" },
      { id: "passport", name: "Passport", nameHi: "पासपोर्ट", slug: "passport", description: "Passport application assistance", descriptionHi: "पासपोर्ट आवेदन सहायता", officialPortal: "https://portal2.passportindia.gov.in" },
    ],
  },
  {
    id: "certificates",
    name: "Certificates",
    nameHi: "प्रमाण पत्र",
    slug: "certificates",
    icon: "FileCheck",
    description: "Income, Caste, Domicile & more certificates",
    descriptionHi: "आय, जाति, अधिवास और अन्य प्रमाण पत्र",
    services: [
      { id: "income-cert", name: "Income Certificate", nameHi: "आय प्रमाण पत्र", slug: "income-certificate", description: "Apply for income certificate", descriptionHi: "आय प्रमाण पत्र के लिए आवेदन", popular: true },
      { id: "caste-cert", name: "Caste Certificate", nameHi: "जाति प्रमाण पत्र", slug: "caste-certificate", description: "Apply for caste certificate", descriptionHi: "जाति प्रमाण पत्र के लिए आवेदन", popular: true },
      { id: "domicile", name: "Domicile Certificate", nameHi: "अधिवास प्रमाण पत्र", slug: "domicile-certificate", description: "Apply for domicile certificate", descriptionHi: "अधिवास प्रमाण पत्र के लिए आवेदन" },
      { id: "birth-cert", name: "Birth Certificate", nameHi: "जन्म प्रमाण पत्र", slug: "birth-certificate", description: "Apply for birth certificate", descriptionHi: "जन्म प्रमाण पत्र के लिए आवेदन" },
      { id: "death-cert", name: "Death Certificate", nameHi: "मृत्यु प्रमाण पत्र", slug: "death-certificate", description: "Apply for death certificate", descriptionHi: "मृत्यु प्रमाण पत्र के लिए आवेदन" },
      { id: "marriage-cert", name: "Marriage Certificate", nameHi: "विवाह प्रमाण पत्र", slug: "marriage-certificate", description: "Apply for marriage certificate", descriptionHi: "विवाह प्रमाण पत्र के लिए आवेदन" },
      { id: "character-cert", name: "Character Certificate", nameHi: "चरित्र प्रमाण पत्र", slug: "character-certificate", description: "Apply for character certificate", descriptionHi: "चरित्र प्रमाण पत्र के लिए आवेदन" },
      { id: "disability-cert", name: "Disability Certificate", nameHi: "विकलांगता प्रमाण पत्र", slug: "disability-certificate", description: "Apply for disability certificate", descriptionHi: "विकलांगता प्रमाण पत्र के लिए आवेदन" },
      { id: "ews-cert", name: "EWS Certificate", nameHi: "EWS प्रमाण पत्र", slug: "ews-certificate", description: "Apply for EWS certificate", descriptionHi: "EWS प्रमाण पत्र के लिए आवेदन" },
      { id: "ncl-cert", name: "Non-Creamy Layer Certificate", nameHi: "गैर-क्रीमी लेयर प्रमाण पत्र", slug: "non-creamy-layer-certificate", description: "Apply for NCL certificate", descriptionHi: "NCL प्रमाण पत्र के लिए आवेदन" },
    ],
  },
  {
    id: "schemes",
    name: "Government Schemes",
    nameHi: "सरकारी योजनाएं",
    slug: "government-schemes",
    icon: "Landmark",
    description: "Ayushman, eShram, PM Kisan & more",
    descriptionHi: "आयुष्मान, eShram, PM किसान और अधिक",
    services: [
      { id: "ayushman", name: "Ayushman Card", nameHi: "आयुष्मान कार्ड", slug: "ayushman-card", description: "Apply for Ayushman Bharat card", descriptionHi: "आयुष्मान भारत कार्ड के लिए आवेदन", officialPortal: "https://pmjay.gov.in", popular: true },
      { id: "eshram", name: "eShram Card", nameHi: "eShram कार्ड", slug: "eshram-card", description: "Register for eShram card", descriptionHi: "eShram कार्ड के लिए पंजीकरण", officialPortal: "https://eshram.gov.in", popular: true },
      { id: "sambal", name: "Sambal Card", nameHi: "संबल कार्ड", slug: "sambal-card", description: "Apply for Sambal card", descriptionHi: "संबल कार्ड के लिए आवेदन" },
      { id: "labour", name: "Labour Card", nameHi: "श्रमिक कार्ड", slug: "labour-card", description: "Apply for labour card", descriptionHi: "श्रमिक कार्ड के लिए आवेदन" },
      { id: "pm-kisan", name: "PM Kisan", nameHi: "PM किसान", slug: "pm-kisan", description: "PM Kisan registration", descriptionHi: "PM किसान पंजीकरण", officialPortal: "https://pmkisan.gov.in", popular: true },
      { id: "pm-awas", name: "PM Awas", nameHi: "PM आवास", slug: "pm-awas", description: "PM Awas Yojana application", descriptionHi: "PM आवास योजना आवेदन", officialPortal: "https://pmaymis.gov.in" },
      { id: "ujjwala", name: "Ujjwala", nameHi: "उज्ज्वला", slug: "ujjwala", description: "Ujjwala Yojana application", descriptionHi: "उज्ज्वला योजना आवेदन" },
      { id: "pension", name: "Pension Schemes", nameHi: "पension योजनाएं", slug: "pension-schemes", description: "Apply for pension schemes", descriptionHi: "पension योजनाओं के लिए आवेदन" },
      { id: "scholarship", name: "Scholarship", nameHi: "छात्रवृत्ति", slug: "scholarship", description: "Apply for scholarships", descriptionHi: "छात्रवृत्ति के लिए आवेदन" },
      { id: "samagra", name: "Samagra ID", nameHi: "समग्र ID", slug: "samagra-id", description: "Apply for Samagra ID", descriptionHi: "समग्र ID के लिए आवेदन" },
    ],
  },
  {
    id: "business",
    name: "Business Services",
    nameHi: "व्यापार सेवाएं",
    slug: "business-services",
    icon: "Building2",
    description: "GST, Udyam, FSSAI & company registration",
    descriptionHi: "GST, उद्यम, FSSAI और कंपनी पंजीकरण",
    services: [
      { id: "gst-reg", name: "GST Registration", nameHi: "GST पंजीकरण", slug: "gst-registration", description: "Register for GST", descriptionHi: "GST के लिए पंजीकरण", officialPortal: "https://www.gst.gov.in", popular: true },
      { id: "gst-return", name: "GST Return", nameHi: "GST रिटर्न", slug: "gst-return", description: "File GST returns", descriptionHi: "GST रिटर्न दाखिल करें", officialPortal: "https://www.gst.gov.in" },
      { id: "gumasta", name: "Gumasta Licence", nameHi: "गुमास्ता लाइसेंस", slug: "gumasta-licence", description: "Apply for Gumasta licence", descriptionHi: "गुमास्ता लाइसेंस के लिए आवेदन" },
      { id: "udyam", name: "Udyam Registration", nameHi: "उद्यम पंजीकरण", slug: "udyam-registration", description: "Register on Udyam portal", descriptionHi: "उद्यम पोर्टल पर पंजीकरण", officialPortal: "https://udyamregistration.gov.in", popular: true },
      { id: "msme", name: "MSME", nameHi: "MSME", slug: "msme", description: "MSME registration", descriptionHi: "MSME पंजीकरण" },
      { id: "fssai", name: "FSSAI Food Licence", nameHi: "FSSAI खाद्य लाइसेंस", slug: "fssai-food-licence", description: "Apply for FSSAI licence", descriptionHi: "FSSAI लाइसेंस के लिए आवेदन", officialPortal: "https://foscos.fssai.gov.in" },
      { id: "trade-licence", name: "Trade Licence", nameHi: "व्यापार लाइसेंस", slug: "trade-licence", description: "Apply for trade licence", descriptionHi: "व्यापार लाइसेंस के लिए आवेदन" },
      { id: "shop-act", name: "Shop Act", nameHi: "दुकान अधिनियम", slug: "shop-act", description: "Shop & Establishment registration", descriptionHi: "दुकान और प्रतिष्ठान पंजीकरण" },
      { id: "trademark", name: "Trademark Registration", nameHi: "ट्रेडमार्क पंजीकरण", slug: "trademark-registration", description: "Register trademark", descriptionHi: "ट्रेडमार्क पंजीकरण" },
      { id: "company-reg", name: "Company Registration", nameHi: "कंपनी पंजीकरण", slug: "company-registration", description: "Register private limited company", descriptionHi: "प्राइवेट लिमिटेड कंपनी पंजीकरण" },
      { id: "llp", name: "LLP Registration", nameHi: "LLP पंजीकरण", slug: "llp-registration", description: "Register LLP", descriptionHi: "LLP पंजीकरण" },
      { id: "partnership", name: "Partnership Firm", nameHi: "साझेदारी फर्म", slug: "partnership-firm", description: "Register partnership firm", descriptionHi: "साझेदारी फर्म पंजीकरण" },
      { id: "iec", name: "IEC Import Export Code", nameHi: "IEC आयात निर्यात कोड", slug: "iec-import-export", description: "Apply for IEC code", descriptionHi: "IEC कोड के लिए आवेदन" },
    ],
  },
  {
    id: "banking",
    name: "Banking Services",
    nameHi: "बैंकिंग सेवाएं",
    slug: "banking-services",
    icon: "Landmark",
    description: "AEPS, money transfer & mini statement",
    descriptionHi: "AEPS, धन हस्तांतरण और मिनी स्टेटमेंट",
    services: [
      { id: "aeps", name: "AEPS", nameHi: "AEPS", slug: "aeps", description: "Aadhaar Enabled Payment System", descriptionHi: "आधार सक्षम भुगतान प्रणाली" },
      { id: "money-transfer", name: "Money Transfer", nameHi: "धन हस्तांतरण", slug: "money-transfer", description: "Domestic money transfer", descriptionHi: "घरेलू धन हस्तांतरण", popular: true },
      { id: "mini-statement", name: "Mini Statement", nameHi: "मिनी स्टेटमेंट", slug: "mini-statement", description: "Get bank mini statement", descriptionHi: "बैंक मिनी स्टेटमेंट प्राप्त करें" },
      { id: "cash-withdrawal", name: "Cash Withdrawal", nameHi: "नकद निकासी", slug: "cash-withdrawal", description: "AEPS cash withdrawal", descriptionHi: "AEPS नकद निकासी" },
      { id: "pan-verify", name: "PAN Verification", nameHi: "PAN सत्यापन", slug: "pan-verification", description: "Verify PAN details", descriptionHi: "PAN विवरण सत्यापित करें" },
    ],
  },
  {
    id: "recharge",
    name: "Recharge & Bill Payment",
    nameHi: "रिचार्ज और बिल भुगतान",
    slug: "recharge-bill-payment",
    icon: "Smartphone",
    description: "Mobile, DTH, electricity & utility bills",
    descriptionHi: "मोबाइल, DTH, बिजली और उपयोगिता बिल",
    services: [
      { id: "mobile-recharge", name: "Mobile Recharge", nameHi: "मोबाइल रिचार्ज", slug: "mobile-recharge", description: "Prepaid & postpaid recharge", descriptionHi: "प्रीपेड और पोस्टपेड रिचार्ज", popular: true },
      { id: "dth", name: "DTH Recharge", nameHi: "DTH रिचार्ज", slug: "dth-recharge", description: "DTH recharge all operators", descriptionHi: "सभी ऑपरेटर DTH रिचार्ज", popular: true },
      { id: "fastag", name: "FASTag Recharge", nameHi: "FASTag रिचार्ज", slug: "fastag-recharge", description: "Recharge FASTag", descriptionHi: "FASTag रिचार्ज करें" },
      { id: "electricity", name: "Electricity Bill", nameHi: "बिजली बिल", slug: "electricity-bill", description: "Pay electricity bill", descriptionHi: "बिजली बिल भुगतान", popular: true },
      { id: "water", name: "Water Bill", nameHi: "पani बिल", slug: "water-bill", description: "Pay water bill", descriptionHi: "पानी बिल भुगतान" },
      { id: "gas", name: "Gas Bill", nameHi: "गैस बिल", slug: "gas-bill", description: "Pay gas bill", descriptionHi: "गैस बिल भुगतान" },
      { id: "broadband", name: "Broadband Bill", nameHi: "ब्रॉडबैंड बिल", slug: "broadband-bill", description: "Pay broadband bill", descriptionHi: "ब्रॉडबैंड बिल भुगतान" },
      { id: "insurance", name: "Insurance Premium", nameHi: "बीमा प्रीमियम", slug: "insurance-premium", description: "Pay insurance premium", descriptionHi: "बीमा प्रीमियम भुगतान" },
      { id: "credit-card", name: "Credit Card Bill", nameHi: "क्रेडिट कार्ड बिल", slug: "credit-card-bill", description: "Pay credit card bill", descriptionHi: "क्रेडिट कार्ड बिल भुगतान" },
    ],
  },
  {
    id: "education",
    name: "Education",
    nameHi: "शिक्षा",
    slug: "education",
    icon: "GraduationCap",
    description: "Scholarship, exam forms & results",
    descriptionHi: "छात्रवृत्ति, परीक्षा फॉर्म और परिणाम",
    services: [
      { id: "scholarship-forms", name: "Scholarship Forms", nameHi: "छात्रवृत्ति फॉर्म", slug: "scholarship-forms", description: "Apply for scholarships", descriptionHi: "छात्रवृत्ति के लिए आवेदन" },
      { id: "exam-forms", name: "Exam Forms", nameHi: "परीक्षा फॉर्म", slug: "exam-forms", description: "Fill exam application forms", descriptionHi: "परीक्षा आवेदन फॉर्म भरें" },
      { id: "university-forms", name: "University Forms", nameHi: "विश्वविद्यालय फॉर्म", slug: "university-forms", description: "University admission forms", descriptionHi: "विश्वविद्यालय प्रवेश फॉर्म" },
      { id: "admit-card", name: "Admit Card", nameHi: "प्रवेश पत्र", slug: "admit-card", description: "Download admit cards", descriptionHi: "प्रवेश पत्र डाउनलोड करें" },
      { id: "result", name: "Result", nameHi: "परिणाम", slug: "result", description: "Check exam results", descriptionHi: "परीक्षा परिणाम देखें" },
    ],
  },
  {
    id: "employment",
    name: "Employment",
    nameHi: "रोजगार",
    slug: "employment",
    icon: "Briefcase",
    description: "Government & private job updates",
    descriptionHi: "सरकारी और निजी नौकरी अपडेट",
    services: [
      { id: "all-india-govt", name: "All India Government Jobs", nameHi: "अखिल भारतीय सरकारी नौकरियां", slug: "all-india-government-jobs", description: "Central government job updates", descriptionHi: "केंद्र सरकारी नौकरी अपडेट", popular: true },
      { id: "state-govt", name: "State Government Jobs", nameHi: "राज्य सरकारी नौकरियां", slug: "state-government-jobs", description: "State government job updates", descriptionHi: "राज्य सरकारी नौकरी अपडेट", popular: true },
      { id: "private-jobs", name: "Private Jobs", nameHi: "निजी नौकरियां", slug: "private-jobs", description: "Private sector job updates", descriptionHi: "निजी क्षेत्र नौकरी अपडेट" },
      { id: "railway", name: "Railway Jobs", nameHi: "रेलवे नौकरियां", slug: "railway-jobs", description: "Indian Railways recruitment", descriptionHi: "भारतीय रेलवे भर्ती", popular: true },
      { id: "ssc", name: "SSC", nameHi: "SSC", slug: "ssc", description: "Staff Selection Commission jobs", descriptionHi: "कर्मचारी चयन आयोग नौकरियां", popular: true },
      { id: "upsc", name: "UPSC", nameHi: "UPSC", slug: "upsc", description: "UPSC civil services jobs", descriptionHi: "UPSC सिविल सेवा नौकरियां" },
      { id: "police", name: "Police", nameHi: "पुलिस", slug: "police-jobs", description: "Police recruitment updates", descriptionHi: "पुलिस भर्ती अपडेट" },
      { id: "army", name: "Army", nameHi: "सena", slug: "army-jobs", description: "Defence recruitment updates", descriptionHi: "रक्षा भर्ती अपडेट" },
      { id: "bank-jobs", name: "Bank Jobs", nameHi: "बैंक नौकरियां", slug: "bank-jobs", description: "Banking sector recruitment", descriptionHi: "बैंकिंग क्षेत्र भर्ती" },
      { id: "teaching", name: "Teaching Jobs", nameHi: "शिक्षण नौकरियां", slug: "teaching-jobs", description: "Teaching recruitment updates", descriptionHi: "शिक्षण भर्ती अपडेट" },
      { id: "it-jobs", name: "IT Jobs", nameHi: "IT नौकरियां", slug: "it-jobs", description: "IT sector job updates", descriptionHi: "IT क्षेत्र नौकरी अपडेट" },
    ],
  },
];

export const allServices = serviceCategories.flatMap((cat) =>
  cat.services.map((s) => ({ ...s, category: cat.slug, categoryName: cat.name, categoryNameHi: cat.nameHi }))
);

export const popularServices = allServices.filter((s) => s.popular);
