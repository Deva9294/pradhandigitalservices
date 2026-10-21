import fs from 'fs';
import path from 'path';

// Define the 17 categories exactly matching user's specification
export const CATEGORIES_CONFIG = [
  {
    id: 1,
    slug: 'identity',
    name: 'Aadhaar, PAN, Voter & Digital Documents',
    nameHi: 'Aadhaar, PAN, Voter एवं डिजिटल दस्तावेज़',
    icon: 'IdCard',
    order: 1,
    description: 'Aadhaar, PAN, Voter ID, Samagra ID, DigiLocker & APAAR ID services',
    descriptionHi: 'आधार, पैन, वोटर आईडी, समग्र आईडी, डिजिलॉकर और अपार आईडी सेवाएं',
    services: [
      { name: "Aadhaar Enrollment", nameHi: "आधार नया नामांकन", slug: "aadhaar-enrollment", fee: 0, charge: 50 },
      { name: "Aadhaar Download", nameHi: "आधार कार्ड डाउनलोड", slug: "aadhaar-download", fee: 0, charge: 30 },
      { name: "Aadhaar PVC Card Order", nameHi: "आधार पीवीसी कार्ड ऑर्डर", slug: "aadhaar-pvc-card-order", fee: 50, charge: 30 },
      { name: "Aadhaar PVC Status", nameHi: "आधार पीवीसी स्थिति जांच", slug: "aadhaar-pvc-status", fee: 0, charge: 20 },
      { name: "Aadhaar Address Update", nameHi: "आधार पता सुधार / अपडेट", slug: "aadhaar-address-update", fee: 50, charge: 50 },
      { name: "Aadhaar Name Update", nameHi: "आधार नाम सुधार / अपडेट", slug: "aadhaar-name-update", fee: 50, charge: 50 },
      { name: "Aadhaar Date of Birth Update", nameHi: "आधार जन्मतिथि सुधार / अपडेट", slug: "aadhaar-dob-update", fee: 50, charge: 50 },
      { name: "Aadhaar Gender Update", nameHi: "आधार लिंग सुधार / अपडेट", slug: "aadhaar-gender-update", fee: 50, charge: 50 },
      { name: "Aadhaar Mobile/Email Update", nameHi: "आधार मोबाइल व ईमेल अपडेट", slug: "aadhaar-mobile-email-update", fee: 50, charge: 50 },
      { name: "Aadhaar Biometric/Photo Update", nameHi: "आधार बायोमेट्रिक व फोटो अपडेट", slug: "aadhaar-biometric-photo-update", fee: 100, charge: 50 },
      { name: "Aadhaar-PAN Linking", nameHi: "आधार-पैन लिंकिंग", slug: "aadhaar-pan-linking", fee: 1000, charge: 50 },
      { name: "Aadhaar Authentication History", nameHi: "आधार प्रमाणीकरण इतिहास", slug: "aadhaar-authentication-history", fee: 0, charge: 30 },
      { name: "VID Generation", nameHi: "वर्चुअल आईडी (VID) निर्माण", slug: "vid-generation", fee: 0, charge: 20 },
      { name: "Aadhaar Lock/Unlock", nameHi: "आधार बायोमेट्रिक लॉक/अनलॉक", slug: "aadhaar-lock-unlock", fee: 0, charge: 30 },
      { name: "New PAN Card", nameHi: "नया पैन कार्ड आवेदन", slug: "new-pan-card", fee: 107, charge: 70 },
      { name: "PAN Correction", nameHi: "पैन कार्ड सुधार / संशोधन", slug: "pan-correction", fee: 107, charge: 80 },
      { name: "PAN Reprint", nameHi: "पैन कार्ड रिप्रिंट", slug: "pan-reprint", fee: 50, charge: 30 },
      { name: "e-PAN Download", nameHi: "ई-पैन कार्ड डाउनलोड", slug: "e-pan-download", fee: 8, charge: 30 },
      { name: "PAN Status Check", nameHi: "पैन कार्ड स्थिति जांच", slug: "pan-status-check", fee: 0, charge: 20 },
      { name: "PAN-Aadhaar Linking", nameHi: "पैन-आधार लिंक स्थिति जांच", slug: "pan-aadhaar-linking-check", fee: 0, charge: 30 },
      { name: "Business/Proprietorship PAN", nameHi: "फर्म/व्यापार पैन कार्ड", slug: "business-proprietorship-pan", fee: 107, charge: 120 },
      { name: "New Voter ID Registration", nameHi: "नया मतदाता परिचय पत्र (फॉर्म 6)", slug: "new-voter-id-registration", fee: 0, charge: 50 },
      { name: "Voter ID Correction", nameHi: "मतदाता पहचान पत्र संशोधन (फॉर्म 8)", slug: "voter-id-correction", fee: 0, charge: 50 },
      { name: "Voter Address Change", nameHi: "मतदाता पता परिवर्तन", slug: "voter-address-change", fee: 0, charge: 50 },
      { name: "Voter ID Deletion", nameHi: "मतदाता सूची से नाम विलोपन (फॉर्म 7)", slug: "voter-id-deletion", fee: 0, charge: 30 },
      { name: "Replacement EPIC", nameHi: "वोटर कार्ड प्रतिस्थापन (Replacement EPIC)", slug: "replacement-epic", fee: 0, charge: 40 },
      { name: "e-EPIC Download", nameHi: "ई-वोटर कार्ड डाउनलोड", slug: "e-epic-download", fee: 0, charge: 30 },
      { name: "Voter List Search", nameHi: "मतदाता सूची में नाम खोजें", slug: "voter-list-search", fee: 0, charge: 20 },
      { name: "Polling Station Search", nameHi: "मतदान केंद्र खोजें", slug: "polling-station-search", fee: 0, charge: 20 },
      { name: "Samagra Family ID", nameHi: "समग्र परिवार आईडी निर्माण", slug: "samagra-family-id", fee: 0, charge: 50 },
      { name: "Samagra Member ID", nameHi: "समग्र सदस्य आईडी खोजें", slug: "samagra-member-id", fee: 0, charge: 20 },
      { name: "New Family Member Addition", nameHi: "समग्र में नया सदस्य जोड़ें", slug: "samagra-member-addition", fee: 0, charge: 50 },
      { name: "Samagra Member Deletion", nameHi: "समग्र से सदस्य हटाएं", slug: "samagra-member-deletion", fee: 0, charge: 40 },
      { name: "Family Division", nameHi: "समग्र परिवार विभाजन", slug: "samagra-family-division", fee: 0, charge: 80 },
      { name: "Marriage Transfer", nameHi: "विवाह उपरांत समग्र ट्रांसफर", slug: "samagra-marriage-transfer", fee: 0, charge: 60 },
      { name: "Mayke to Sasural Transfer", nameHi: "मायके से ससुराल समग्र ट्रांसफर", slug: "mayke-to-sasural-transfer", fee: 0, charge: 60 },
      { name: "Samagra e-KYC", nameHi: "समग्र आधार ई-केवाईसी", slug: "samagra-e-kyc", fee: 0, charge: 40 },
      { name: "Aadhaar-Samagra Linking", nameHi: "आधार-समग्र लिंकिंग", slug: "aadhaar-samagra-linking", fee: 0, charge: 40 },
      { name: "Samagra Correction", nameHi: "समग्र डेटा सुधार (नाम/आयु/लिंग)", slug: "samagra-correction", fee: 0, charge: 50 },
      { name: "Samagra ID Recovery", nameHi: "भूली हुई समग्र आईडी खोजें", slug: "samagra-id-recovery", fee: 0, charge: 30 },
      { name: "Samagra Print", nameHi: "समग्र परिवार कार्ड प्रिंट", slug: "samagra-print", fee: 0, charge: 20 },
      { name: "DigiLocker Registration", nameHi: "डिजिलॉकर खाता पंजीयन", slug: "digilocker-registration", fee: 0, charge: 40 },
      { name: "DigiLocker Document Download", nameHi: "डिजिलॉकर दस्तावेज़ डाउनलोड", slug: "digilocker-document-download", fee: 0, charge: 30 },
      { name: "UMANG Registration", nameHi: "उमंग पोर्टल पंजीयन", slug: "umang-registration", fee: 0, charge: 40 },
      { name: "ABC ID", nameHi: "एकेडेमिक बैंक ऑफ क्रेडिट्स (ABC ID)", slug: "abc-id-creation", fee: 0, charge: 40 },
      { name: "APAAR ID", nameHi: "अपार (APAAR) स्टूडेंट आईडी", slug: "apaar-id-creation", fee: 0, charge: 40 }
    ]
  },
  {
    id: 2,
    slug: 'certificates',
    name: 'Certificates & Public Services',
    nameHi: 'प्रमाण-पत्र एवं लोक सेवा',
    icon: 'FileCheck',
    order: 2,
    description: 'Income, Caste, Domicile, Birth, Death, Marriage, EWS & Affidavits',
    descriptionHi: 'आय, जाति, मूल निवास, जन्म, मृत्यु, विवाह, ईडब्ल्यूएस और शपथ पत्र',
    services: [
      { name: "Income Certificate", nameHi: "आय प्रमाण पत्र", slug: "income-certificate", fee: 0, charge: 60 },
      { name: "Caste Certificate", nameHi: "जाति प्रमाण पत्र (SC/ST/OBC)", slug: "caste-certificate", fee: 0, charge: 70 },
      { name: "Domicile/Residence Certificate", nameHi: "मूल निवासी प्रमाण पत्र", slug: "domicile-residence-certificate", fee: 0, charge: 60 },
      { name: "EWS Certificate", nameHi: "ईडब्ल्यूएस (EWS) प्रमाण पत्र", slug: "ews-certificate", fee: 0, charge: 80 },
      { name: "OBC Non-Creamy Layer Certificate", nameHi: "ओबीसी नॉन-क्रीमी लेयर प्रमाण पत्र", slug: "obc-non-creamy-layer-certificate", fee: 0, charge: 70 },
      { name: "Solvency Certificate", nameHi: "हैसियत प्रमाण पत्र", slug: "solvency-certificate", fee: 0, charge: 100 },
      { name: "Character Certificate", nameHi: "चरित्र प्रमाण पत्र", slug: "character-certificate", fee: 0, charge: 70 },
      { name: "Employment Registration Certificate", nameHi: "रोजगार पंजीयन प्रमाण पत्र", slug: "employment-registration-certificate", fee: 0, charge: 50 },
      { name: "Birth Certificate", nameHi: "जन्म प्रमाण पत्र", slug: "birth-certificate", fee: 0, charge: 70 },
      { name: "Birth Certificate Correction", nameHi: "जन्म प्रमाण पत्र सुधार", slug: "birth-certificate-correction", fee: 0, charge: 80 },
      { name: "Death Certificate", nameHi: "मृत्यु प्रमाण पत्र", slug: "death-certificate", fee: 0, charge: 70 },
      { name: "Marriage Registration", nameHi: "विवाह पंजीयन आवेदन", slug: "marriage-registration", fee: 50, charge: 100 },
      { name: "Marriage Certificate", nameHi: "विवाह प्रमाण पत्र", slug: "marriage-certificate", fee: 50, charge: 80 },
      { name: "Unmarried Certificate", nameHi: "अविवाहित प्रमाण पत्र", slug: "unmarried-certificate", fee: 0, charge: 60 },
      { name: "Widow Certificate", nameHi: "विधवा प्रमाण पत्र", slug: "widow-certificate", fee: 0, charge: 60 },
      { name: "Disability Certificate", nameHi: "दिव्यांग प्रमाण पत्र", slug: "disability-certificate-lokseva", fee: 0, charge: 60 },
      { name: "Senior Citizen Certificate", nameHi: "वरिष्ठ नागरिक प्रमाण पत्र", slug: "senior-citizen-certificate", fee: 0, charge: 50 },
      { name: "Legal Heir Certificate", nameHi: "वारिसान / उत्तराधिकारी प्रमाण पत्र", slug: "legal-heir-certificate", fee: 0, charge: 120 },
      { name: "Family Member Certificate", nameHi: "परिवार सदस्य प्रमाण पत्र", slug: "family-member-certificate", fee: 0, charge: 60 },
      { name: "Name Change Affidavit", nameHi: "नाम परिवर्तन शपथ पत्र", slug: "name-change-affidavit", fee: 50, charge: 70 },
      { name: "Address Affidavit", nameHi: "पता प्रमाण शपथ पत्र", slug: "address-affidavit", fee: 50, charge: 70 },
      { name: "Income Affidavit", nameHi: "आय घोषणा शपथ पत्र", slug: "income-affidavit", fee: 50, charge: 70 },
      { name: "Self Declaration", nameHi: "स्व-घोषणा पत्र", slug: "self-declaration", fee: 0, charge: 40 },
      { name: "Undertaking", nameHi: "वचन पत्र / अंडरटेकिंग", slug: "undertaking-drafting", fee: 0, charge: 40 },
      { name: "Application Drafting", nameHi: "विभागीय आवेदन प्रारूपण", slug: "application-drafting", fee: 0, charge: 50 },
      { name: "Hindi-English Typing", nameHi: "हिंदी-अंग्रेजी टंकण (टाइपिंग)", slug: "hindi-english-typing-service", fee: 0, charge: 30 },
      { name: "Lok Seva Application", nameHi: "लोक सेवा गारंटी आवेदन", slug: "lok-seva-application", fee: 0, charge: 60 },
      { name: "Application Status", nameHi: "लोक सेवा आवेदन स्थिति जांच", slug: "lok-seva-application-status", fee: 0, charge: 20 },
      { name: "Certificate Download", nameHi: "डिजिटल हस्ताक्षरित प्रमाण पत्र डाउनलोड", slug: "certificate-download-service", fee: 0, charge: 30 },
      { name: "CM Helpline Complaint", nameHi: "सीएम हेल्पलाइन 181 शिकायत दर्ज", slug: "cm-helpline-complaint", fee: 0, charge: 40 },
      { name: "RTI Application", nameHi: "सूचना का अधिकार (RTI) आवेदन", slug: "rti-application-service", fee: 10, charge: 80 }
    ]
  },
  {
    id: 3,
    slug: 'ration-food',
    name: 'Ration, Food & LPG Services',
    nameHi: 'राशन, खाद्य एवं LPG सेवाएँ',
    icon: 'Wheat',
    order: 3,
    description: 'Ration card application, member updates, e-KYC, LPG subsidy & FSSAI',
    descriptionHi: 'राशन कार्ड, सदस्य जोड़ना/हटाना, ई-केवाईसी, गैस सब्सिडी और एफएसएसएआई',
    services: [
      { name: "New Ration Card", nameHi: "नया राशन कार्ड आवेदन", slug: "new-ration-card", fee: 0, charge: 80 },
      { name: "Ration Card Correction", nameHi: "राशन कार्ड संशोधन / सुधार", slug: "ration-card-correction", fee: 0, charge: 60 },
      { name: "Ration Card Family Member Addition", nameHi: "राशन कार्ड में सदस्य जोड़ना", slug: "ration-card-family-member-addition", fee: 0, charge: 50 },
      { name: "Ration Card Member Deletion", nameHi: "राशन कार्ड से सदस्य हटाना", slug: "ration-card-member-deletion", fee: 0, charge: 40 },
      { name: "Duplicate Ration Card", nameHi: "डुप्लीकेट राशन कार्ड", slug: "duplicate-ration-card", fee: 0, charge: 50 },
      { name: "Ration e-KYC", nameHi: "राशन कार्ड ई-केवाईसी", slug: "ration-e-kyc", fee: 0, charge: 40 },
      { name: "Eligibility Slip Download", nameHi: "पात्रता पर्ची डाउनलोड", slug: "ration-eligibility-slip-download", fee: 0, charge: 30 },
      { name: "Ration Card Print", nameHi: "राशन कार्ड प्रिंट", slug: "ration-card-print", fee: 0, charge: 20 },
      { name: "FPS/Shop Search", nameHi: "उचित मूल्य दुकान (FPS) खोजें", slug: "fps-shop-search", fee: 0, charge: 20 },
      { name: "Ration Entitlement", nameHi: "मासिक राशन पात्रता जांच", slug: "ration-entitlement-check", fee: 0, charge: 20 },
      { name: "Ration Transaction History", nameHi: "राशन वितरण इतिहास", slug: "ration-transaction-history", fee: 0, charge: 20 },
      { name: "One Nation One Ration Card", nameHi: "वन नेशन वन राशन कार्ड पोर्टेबिलिटी", slug: "one-nation-one-ration-card", fee: 0, charge: 50 },
      { name: "Ration Complaint", nameHi: "राशन वितरण शिकायत", slug: "ration-complaint", fee: 0, charge: 30 },
      { name: "Food Department Complaint", nameHi: "खाद्य विभाग शिकायत", slug: "food-department-complaint", fee: 0, charge: 30 },
      { name: "LPG New Connection", nameHi: "उज्ज्वला / नया एलपीजी कनेक्शन", slug: "lpg-new-connection", fee: 0, charge: 60 },
      { name: "LPG Refill Booking", nameHi: "एलपीजी गैस सिलेंडर रिफिल बुकिंग", slug: "lpg-refill-booking", fee: 0, charge: 25 },
      { name: "LPG Subsidy Status", nameHi: "गैस सब्सिडी बैंक ट्रांसफर स्थिति", slug: "lpg-subsidy-status", fee: 0, charge: 25 },
      { name: "LPG KYC", nameHi: "एलपीजी गैस बायोमेट्रिक ई-केवाईसी", slug: "lpg-kyc-service", fee: 0, charge: 40 },
      { name: "Gas Connection Transfer", nameHi: "गैस कनेक्शन ट्रांसफर", slug: "gas-connection-transfer", fee: 0, charge: 60 },
      { name: "FSSAI Registration", nameHi: "खाद्य सुरक्षा (FSSAI) रजिस्ट्रेशन", slug: "fssai-registration", fee: 100, charge: 150 },
      { name: "FSSAI State Licence", nameHi: "FSSAI राज्य लाइसेंस", slug: "fssai-state-licence", fee: 2000, charge: 350 },
      { name: "FSSAI Central Licence", nameHi: "FSSAI सेंट्रल लाइसेंस", slug: "fssai-central-licence", fee: 7500, charge: 500 },
      { name: "FSSAI Renewal", nameHi: "FSSAI लाइसेंस नवीनीकरण", slug: "fssai-renewal", fee: 100, charge: 120 },
      { name: "FSSAI Modification", nameHi: "FSSAI लाइसेंस संशोधन", slug: "fssai-modification", fee: 100, charge: 120 },
      { name: "FSSAI Annual Return", nameHi: "FSSAI वार्षिक रिटर्न", slug: "fssai-annual-return", fee: 0, charge: 200 }
    ]
  },
  {
    id: 4,
    slug: 'rto-vehicle',
    name: 'Driving Licence, RTO & Vehicle Services',
    nameHi: 'Driving Licence, RTO एवं वाहन सेवाएँ',
    icon: 'Car',
    order: 4,
    description: 'Learner/Driving licence, RC, ownership transfer, challan, FASTag & HSRP',
    descriptionHi: 'ड्राइविंग लाइसेंस, वाहन पंजीयन (RC), चालान, हाई सिक्योरिटी नंबर प्लेट',
    services: [
      { name: "Learner Licence", nameHi: "लर्निंग लाइसेंस आवेदन", slug: "learner-licence-application", fee: 200, charge: 100 },
      { name: "Driving Licence", nameHi: "स्थायी ड्राइविंग लाइसेंस (DL)", slug: "driving-licence-application", fee: 400, charge: 150 },
      { name: "DL Renewal", nameHi: "ड्राइविंग लाइसेंस नवीनीकरण", slug: "dl-renewal", fee: 400, charge: 120 },
      { name: "Duplicate Driving Licence", nameHi: "डुप्लीकेट ड्राइविंग लाइसेंस", slug: "duplicate-driving-licence", fee: 400, charge: 100 },
      { name: "DL Address Correction", nameHi: "डीएल में पता संशोधन", slug: "dl-address-correction", fee: 200, charge: 80 },
      { name: "DL Name Correction", nameHi: "डीएल में नाम संशोधन", slug: "dl-name-correction", fee: 200, charge: 80 },
      { name: "DL Date of Birth Correction", nameHi: "डीएल में जन्मतिथि सुधार", slug: "dl-dob-correction", fee: 200, charge: 80 },
      { name: "DL Mobile Update", nameHi: "डीएल में मोबाइल नंबर अपडेट", slug: "dl-mobile-update", fee: 0, charge: 40 },
      { name: "DL Extract", nameHi: "डीएल एक्सट्रैक्ट रिकॉर्ड", slug: "dl-extract", fee: 100, charge: 60 },
      { name: "Online LL Test", nameHi: "लर्निंग लाइसेंस ऑनलाइन टेस्ट सहायता", slug: "online-ll-test-assistance", fee: 0, charge: 50 },
      { name: "DL Slot Booking", nameHi: "आरटीओ स्लॉट बुकिंग", slug: "dl-slot-booking", fee: 0, charge: 40 },
      { name: "Conductor Licence", nameHi: "कंडक्टर लाइसेंस", slug: "conductor-licence", fee: 200, charge: 100 },
      { name: "Driving School Licence", nameHi: "ड्राइविंग स्कूल लाइसेंस", slug: "driving-school-licence", fee: 2500, charge: 500 },
      { name: "Vehicle Registration", nameHi: "नया वाहन पंजीयन (RC)", slug: "vehicle-registration", fee: 600, charge: 200 },
      { name: "RC Download", nameHi: "डिजिटल आरसी डाउनलोड", slug: "rc-download", fee: 0, charge: 30 },
      { name: "Duplicate RC", nameHi: "डुप्लीकेट आरसी आवेदन", slug: "duplicate-rc", fee: 300, charge: 100 },
      { name: "Vehicle Ownership Transfer", nameHi: "वाहन स्वामित्व स्थानांतरण (RC Transfer)", slug: "vehicle-ownership-transfer", fee: 300, charge: 200 },
      { name: "Address Change in RC", nameHi: "आरसी में पता परिवर्तन", slug: "address-change-in-rc", fee: 200, charge: 80 },
      { name: "Hypothecation Addition", nameHi: "हाइपोथिकेशन (HPA/Loan) दर्ज करें", slug: "hypothecation-addition", fee: 500, charge: 120 },
      { name: "Hypothecation Termination", nameHi: "हाइपोथिकेशन समाप्ति (HPT/NOC)", slug: "hypothecation-termination", fee: 100, charge: 100 },
      { name: "NOC", nameHi: "वाहन एनओसी (NOC)", slug: "vehicle-noc", fee: 100, charge: 100 },
      { name: "Vehicle Tax", nameHi: "वाहन रोड टैक्स भुगतान", slug: "vehicle-tax-payment", fee: 0, charge: 70 },
      { name: "Permit", nameHi: "वाहन परमिट आवेदन", slug: "vehicle-permit", fee: 500, charge: 150 },
      { name: "National Permit", nameHi: "नेशनल परमिट", slug: "national-permit", fee: 1000, charge: 200 },
      { name: "Fitness Certificate", nameHi: "वाहन फिटनेस प्रमाण पत्र", slug: "fitness-certificate", fee: 600, charge: 150 },
      { name: "Temporary Registration", nameHi: "अस्थायी वाहन पंजीयन", slug: "temporary-registration", fee: 200, charge: 80 },
      { name: "Vehicle Details Search", nameHi: "वाहन विवरण खोजें (RC Info)", slug: "vehicle-details-search", fee: 0, charge: 25 },
      { name: "e-Challan Status", nameHi: "ई-चालान स्थिति जांच", slug: "e-challan-status", fee: 0, charge: 20 },
      { name: "e-Challan Payment", nameHi: "ई-चालान ऑनलाइन भुगतान", slug: "e-challan-payment", fee: 0, charge: 50 },
      { name: "PUC Status", nameHi: "प्रदूषण प्रमाण पत्र (PUC) स्थिति", slug: "puc-status", fee: 0, charge: 20 },
      { name: "HSRP Number Plate", nameHi: "हाई सिक्योरिटी नंबर प्लेट (HSRP) बुकिंग", slug: "hsrp-number-plate-order", fee: 400, charge: 80 },
      { name: "FASTag Recharge", nameHi: "फास्टैग ऑनलाइन रिचार्ज", slug: "fastag-recharge-service", fee: 0, charge: 20 },
      { name: "FASTag KYC", nameHi: "फास्टैग ई-केवाईसी अपडेट", slug: "fastag-kyc-service", fee: 0, charge: 40 },
      { name: "FASTag Closure", nameHi: "फास्टैग बंद/रिफंड आवेदन", slug: "fastag-closure-service", fee: 0, charge: 50 }
    ]
  },
  {
    id: 5,
    slug: 'passport-police',
    name: 'Passport, Police & Legal Services',
    nameHi: 'Passport, Police एवं कानूनी सेवाएँ',
    icon: 'ShieldCheck',
    order: 5,
    description: 'Passport application, PCC, police verification, lost articles & court cases',
    descriptionHi: 'पासपोर्ट सेवा, पुलिस सत्यापन, चरित्र प्रमाण पत्र, गुमशुदगी रिपोर्ट',
    services: [
      { name: "New Passport", nameHi: "नया पासपोर्ट आवेदन", slug: "new-passport-application", fee: 1500, charge: 200 },
      { name: "Passport Renewal", nameHi: "पासपोर्ट नवीनीकरण (Renewal)", slug: "passport-renewal", fee: 1500, charge: 200 },
      { name: "Passport Reissue", nameHi: "पासपोर्ट पुनः जारी (Reissue)", slug: "passport-reissue", fee: 1500, charge: 200 },
      { name: "Passport Correction", nameHi: "पासपोर्ट डेटा संशोधन", slug: "passport-correction", fee: 1500, charge: 200 },
      { name: "Passport Address Change", nameHi: "पासपोर्ट में पता परिवर्तन", slug: "passport-address-change", fee: 1500, charge: 200 },
      { name: "Passport Appointment", nameHi: "पासपोर्ट सेवा केंद्र अपॉइंटमेंट", slug: "passport-appointment-booking", fee: 0, charge: 100 },
      { name: "Passport Tracking", nameHi: "पासपोर्ट आवेदन स्थिति ट्रैकिंग", slug: "passport-tracking", fee: 0, charge: 20 },
      { name: "Police Verification Status", nameHi: "पुलिस वेरिफिकेशन स्थिति जांच", slug: "police-verification-status", fee: 0, charge: 30 },
      { name: "PCC Guidance", nameHi: "पुलिस क्लीयरेंस सर्टिफिकेट (PCC)", slug: "pcc-guidance", fee: 500, charge: 150 },
      { name: "Lost Mobile Report", nameHi: "गुमशुदा मोबाइल रिपोर्ट (CEIR/Police)", slug: "lost-mobile-report", fee: 0, charge: 50 },
      { name: "Lost Aadhaar Report", nameHi: "गुमशुदा आधार रिपोर्ट", slug: "lost-aadhaar-report", fee: 0, charge: 40 },
      { name: "Lost PAN Report", nameHi: "गुमशुदा पैन कार्ड रिपोर्ट", slug: "lost-pan-report", fee: 0, charge: 40 },
      { name: "Lost DL Report", nameHi: "गुमशुदा ड्राइविंग लाइसेंस रिपोर्ट", slug: "lost-dl-report", fee: 0, charge: 40 },
      { name: "Lost Certificate Report", nameHi: "गुमशुदा शैक्षणिक अंकसूची रिपोर्ट", slug: "lost-certificate-report", fee: 0, charge: 40 },
      { name: "Lost ATM/Card Report", nameHi: "गुमशुदा एटीएम कार्ड शिकायत", slug: "lost-atm-card-report", fee: 0, charge: 40 },
      { name: "Police Complaint", nameHi: "ऑनलाइन पुलिस शिकायत (e-FIR)", slug: "police-complaint", fee: 0, charge: 60 },
      { name: "FIR Search", nameHi: "ऑनलाइन एफआईआर खोजें", slug: "fir-search", fee: 0, charge: 30 },
      { name: "FIR Copy/Status", nameHi: "एफआईआर प्रति व स्थिति", slug: "fir-copy-status", fee: 0, charge: 30 },
      { name: "Missing Person Search", nameHi: "लापता व्यक्ति खोज पोर्टल", slug: "missing-person-search", fee: 0, charge: 20 },
      { name: "Stolen Vehicle Search", nameHi: "चोरी वाहन खोज पोर्टल", slug: "stolen-vehicle-search", fee: 0, charge: 20 },
      { name: "Police Verification", nameHi: "नागरिक चरित्र सत्यापन", slug: "police-verification-citizen", fee: 100, charge: 70 },
      { name: "Tenant Verification", nameHi: "किरायेदार पुलिस सत्यापन", slug: "tenant-verification", fee: 0, charge: 60 },
      { name: "Employee Verification", nameHi: "कर्मचारी पुलिस सत्यापन", slug: "employee-verification", fee: 0, charge: 70 },
      { name: "Cybercrime Complaint", nameHi: "साइबर फ्रॉड / अपराध शिकायत", slug: "cybercrime-complaint", fee: 0, charge: 80 },
      { name: "e-Courts Case Status", nameHi: "ई-कोर्ट केस स्थिति जांच", slug: "e-courts-case-status", fee: 0, charge: 30 },
      { name: "Cause List", nameHi: "दैनिक कोर्ट कॉज लिस्ट", slug: "court-cause-list", fee: 0, charge: 20 },
      { name: "Court Order Download", nameHi: "न्यायालय आदेश व निर्णय डाउनलोड", slug: "court-order-download", fee: 0, charge: 30 },
      { name: "e-Filing Guidance", nameHi: "ई-फाइलिंग मार्गदर्शन", slug: "e-filing-guidance", fee: 0, charge: 100 },
      { name: "Legal Aid Application", nameHi: "मुफ्त कानूनी सहायता आवेदन", slug: "legal-aid-application", fee: 0, charge: 50 },
      { name: "Lok Adalat Information", nameHi: "राष्ट्रीय लोक अदालत जानकारी", slug: "lok-adalat-information", fee: 0, charge: 20 }
    ]
  },
  {
    id: 6,
    slug: 'municipal',
    name: 'Municipal & Panchayat Services',
    nameHi: 'नगर पालिका एवं पंचायत सेवाएँ',
    icon: 'Building2',
    order: 6,
    description: 'Property tax, water connection, trade licence, building permission & complaints',
    descriptionHi: 'संपत्ति कर, जल नल कनेक्शन, ट्रेड लाइसेंस, भवन निर्माण एवं जन शिकायत',
    services: [
      { name: "Property Tax", nameHi: "संपत्ति कर (प्रॉपर्टी टैक्स) भुगतान", slug: "municipal-property-tax", fee: 0, charge: 50 },
      { name: "Water Bill", nameHi: "नगर पालिका जल कर भुगतान", slug: "municipal-water-bill", fee: 0, charge: 30 },
      { name: "New Water Connection", nameHi: "नया नल जल कनेक्शन आवेदन", slug: "new-water-connection", fee: 500, charge: 100 },
      { name: "Water Connection Correction", nameHi: "जल कनेक्शन विवरण सुधार", slug: "water-connection-correction", fee: 0, charge: 60 },
      { name: "Garbage Fee", nameHi: "कचरा संग्रहण शुल्क भुगतान", slug: "garbage-fee-payment", fee: 0, charge: 30 },
      { name: "Sewerage Fee", nameHi: "सीवरेज शुल्क भुगतान", slug: "sewerage-fee-payment", fee: 0, charge: 30 },
      { name: "Trade Licence", nameHi: "ट्रेड लाइसेंस आवेदन", slug: "trade-licence-municipal", fee: 500, charge: 150 },
      { name: "Trade Licence Renewal", nameHi: "ट्रेड लाइसेंस नवीनीकरण", slug: "trade-licence-renewal-municipal", fee: 500, charge: 120 },
      { name: "Advertisement/Hoarding Permission", nameHi: "विज्ञापन व होर्डिंग अनुमति", slug: "advertisement-hoarding-permission", fee: 1000, charge: 200 },
      { name: "Building Permission", nameHi: "भवन निर्माण अनुमति (BPA)", slug: "building-permission", fee: 1000, charge: 300 },
      { name: "Property Mutation", nameHi: "नगर पालिका संपत्ति नामांतरण", slug: "municipal-property-mutation", fee: 200, charge: 150 },
      { name: "Birth Registration", nameHi: "शहरी क्षेत्र जन्म पंजीयन", slug: "municipal-birth-registration", fee: 0, charge: 70 },
      { name: "Death Registration", nameHi: "शहरी क्षेत्र मृत्यु पंजीयन", slug: "municipal-death-registration", fee: 0, charge: 70 },
      { name: "Marriage Registration", nameHi: "शहरी क्षेत्र विवाह पंजीयन", slug: "municipal-marriage-registration", fee: 50, charge: 100 },
      { name: "Fire NOC", nameHi: "फायर एनओसी आवेदन", slug: "fire-noc-application", fee: 500, charge: 250 },
      { name: "Garbage Complaint", nameHi: "सफाई व कचरा शिकायत", slug: "garbage-complaint", fee: 0, charge: 25 },
      { name: "Streetlight Complaint", nameHi: "स्ट्रीट लाइट बंद शिकायत", slug: "streetlight-complaint", fee: 0, charge: 25 },
      { name: "Road/Drain Complaint", nameHi: "सड़क व नाली मरम्मत शिकायत", slug: "road-drain-complaint", fee: 0, charge: 25 },
      { name: "Water Tanker Request", nameHi: "पानी टैंकर मांग आवेदन", slug: "water-tanker-request", fee: 200, charge: 40 },
      { name: "Ambulance Request", nameHi: "शव वाहन / एम्बुलेंस सहायता", slug: "ambulance-request", fee: 0, charge: 20 },
      { name: "Funeral Vehicle Request", nameHi: "मोक्ष वाहन / शव वाहन अनुरोध", slug: "funeral-vehicle-request", fee: 0, charge: 20 },
      { name: "Tree Cutting Permission", nameHi: "वृक्ष कटाई अनुमति आवेदन", slug: "tree-cutting-permission", fee: 100, charge: 80 },
      { name: "Municipal Grievance", nameHi: "नगर पालिका जन शिकायत निवारण", slug: "municipal-grievance", fee: 0, charge: 30 },
      { name: "Panchayat Certificate", nameHi: "ग्राम पंचायत प्रमाण पत्र", slug: "panchayat-certificate", fee: 0, charge: 40 },
      { name: "Local Complaint", nameHi: "पंचायत स्थानीय समस्या शिकायत", slug: "panchayat-local-complaint", fee: 0, charge: 30 }
    ]
  },
  {
    id: 7,
    slug: 'land-revenue',
    name: 'Land & Revenue Services',
    nameHi: 'भूमि एवं राजस्व सेवाएँ',
    icon: 'Map',
    order: 7,
    description: 'Khasra, Khatauni, B-1, Bhulekh, registry valuation, e-Stamp & mutation',
    descriptionHi: 'खसरा, खतौनी, बी-1, नामांतरण, बंटवारा, ई-स्टाम्प और रजिस्ट्री दस्तावेज',
    services: [
      { name: "Khasra", nameHi: "खसरा नकल (MP Bhulekh)", slug: "khasra-nakal", fee: 30, charge: 30 },
      { name: "Khatauni", nameHi: "खतौनी नकल", slug: "khatauni-nakal", fee: 30, charge: 30 },
      { name: "B-1", nameHi: "बी-1 किश्तबंदी खतौनी", slug: "b1-nakal", fee: 30, charge: 30 },
      { name: "Bhulekh Search", nameHi: "भू-अभिलेख खसरा खोजें", slug: "bhulekh-search", fee: 0, charge: 20 },
      { name: "Bhu-Naksha", nameHi: "भू-नक्शा (जमीन का नक्शा)", slug: "bhu-naksha", fee: 30, charge: 30 },
      { name: "Digitally Signed Land Record", nameHi: "डिजिटल हस्ताक्षरित खसरा/नक्शा", slug: "digitally-signed-land-record", fee: 30, charge: 40 },
      { name: "Landowner Details", nameHi: "भू-स्वामी विवरण खोजें", slug: "landowner-details-search", fee: 0, charge: 20 },
      { name: "Mutation Status", nameHi: "नामांतरण स्थिति जांच (RCMS)", slug: "mutation-status-rcms", fee: 0, charge: 25 },
      { name: "Mutation Application", nameHi: "जमीन नामांतरण आवेदन", slug: "mutation-application", fee: 100, charge: 150 },
      { name: "Land Partition", nameHi: "जमीन बंटवारा आवेदन", slug: "land-partition-application", fee: 100, charge: 150 },
      { name: "Land Demarcation", nameHi: "सीमांकन (जमीन नपाई) आवेदन", slug: "land-demarcation-application", fee: 100, charge: 150 },
      { name: "Revenue Case Status", nameHi: "राजस्व न्यायालय केस स्थिति (RCMS)", slug: "revenue-case-status", fee: 0, charge: 30 },
      { name: "Revenue Court Order", nameHi: "तहसील/एसडीएम कोर्ट आदेश डाउनलोड", slug: "revenue-court-order", fee: 0, charge: 40 },
      { name: "Registry Appointment", nameHi: "संपदा 2.0 रजिस्ट्री स्लॉट बुकिंग", slug: "registry-appointment-sampada", fee: 0, charge: 100 },
      { name: "Property Valuation", nameHi: "संपत्ति मूल्यांकन दर (गाइडलाइन)", slug: "property-valuation-guideline", fee: 0, charge: 60 },
      { name: "Guideline Rate", nameHi: "क्षेत्रीय गाइडलाइन दर खोजें", slug: "guideline-rate-search", fee: 0, charge: 30 },
      { name: "Stamp Duty Calculation", nameHi: "स्टाम्प शुल्क गणना", slug: "stamp-duty-calculation", fee: 0, charge: 40 },
      { name: "Registration Fee Calculation", nameHi: "पंजीयन शुल्क गणना", slug: "registration-fee-calculation", fee: 0, charge: 40 },
      { name: "e-Stamp", nameHi: "ई-स्टाम्प पेपर जारी करना", slug: "e-stamp-generation", fee: 50, charge: 50 },
      { name: "Property Registration", nameHi: "संपत्ति पंजीयन दस्तावेज तैयारी", slug: "property-registration-assistance", fee: 0, charge: 300 },
      { name: "Certified Registry Copy", nameHi: "पुरानी रजिस्ट्री प्रमाणित प्रति", slug: "certified-registry-copy", fee: 150, charge: 100 },
      { name: "Document Verification", nameHi: "रजिस्ट्री दस्तावेज सत्यापन", slug: "registry-document-verification", fee: 0, charge: 50 },
      { name: "Land Record Correction", nameHi: "खसरा नाम/रकबा त्रुटि सुधार", slug: "land-record-correction", fee: 0, charge: 100 }
    ]
  },
  {
    id: 8,
    slug: 'agriculture',
    name: 'Agriculture & Farmer Services',
    nameHi: 'कृषि एवं किसान सेवाएँ',
    icon: 'Sprout',
    order: 8,
    description: 'PM-Kisan, MP Kisan, crop insurance, e-Uparjan, solar pump & farm subsidies',
    descriptionHi: 'पीएम किसान, ई-उपार्जन पंजीयन, फसल बीमा, कृषि यंत्र एवं सोलर पंप सब्सिडी',
    services: [
      { name: "MP Kisan Registration", nameHi: "एमपी किसान पोर्टल पंजीयन", slug: "mp-kisan-registration", fee: 0, charge: 50 },
      { name: "Farmer ID", nameHi: "किसान आईडी निर्माण", slug: "farmer-id-creation", fee: 0, charge: 40 },
      { name: "Farmer Registry", nameHi: "फार्मर रजिस्ट्री सत्यापन", slug: "farmer-registry-verification", fee: 0, charge: 40 },
      { name: "PM-Kisan Registration", nameHi: "पीएम किसान सम्मान निधि नया पंजीयन", slug: "pm-kisan-registration", fee: 0, charge: 60 },
      { name: "PM-Kisan e-KYC", nameHi: "पीएम किसान बायोमेट्रिक / ओटीपी ई-केवाईसी", slug: "pm-kisan-e-kyc", fee: 0, charge: 40 },
      { name: "PM-Kisan Correction", nameHi: "पीएम किसान नाम/आधार/खाता सुधार", slug: "pm-kisan-correction", fee: 0, charge: 50 },
      { name: "PM-Kisan Installment Status", nameHi: "पीएम किसान किस्त स्थिति जांच", slug: "pm-kisan-installment-status", fee: 0, charge: 20 },
      { name: "PM-Kisan Beneficiary Status", nameHi: "पीएम किसान लाभार्थी स्थिति जांच", slug: "pm-kisan-beneficiary-status", fee: 0, charge: 20 },
      { name: "PM Fasal Bima", nameHi: "प्रधानमंत्री फसल बीमा योजना (PMFBY)", slug: "pm-fasal-bima", fee: 0, charge: 60 },
      { name: "Crop Insurance Claim", nameHi: "फसल बीमा क्लेम स्थिति", slug: "crop-insurance-claim-status", fee: 0, charge: 30 },
      { name: "e-Uparjan Registration", nameHi: "ई-उपार्जन रबी/खरीफ पंजीयन", slug: "e-uparjan-registration", fee: 0, charge: 60 },
      { name: "e-Uparjan Slot Booking", nameHi: "उपार्जन स्लॉट बुकिंग (तुलाई केंद्र)", slug: "e-uparjan-slot-booking", fee: 0, charge: 40 },
      { name: "Procurement Receipt", nameHi: "उपार्जन तुलाई रसीद डाउनलोड", slug: "procurement-receipt-download", fee: 0, charge: 20 },
      { name: "Farmer Payment Status", nameHi: "उपार्जन फसल भुगतान स्थिति", slug: "farmer-payment-status", fee: 0, charge: 20 },
      { name: "e-Mandi Registration", nameHi: "ई-मंडी किसान पंजीयन", slug: "e-mandi-registration", fee: 0, charge: 50 },
      { name: "Mandi Rate", nameHi: "दैनिक मंडी भाव जानकारी", slug: "mandi-rate-check", fee: 0, charge: 20 },
      { name: "Mandi Payment", nameHi: "मंडी भुगतान स्थिति", slug: "mandi-payment-status", fee: 0, charge: 20 },
      { name: "Fertilizer Token", nameHi: "खाद टोकन बुकिंग (इफको/सोसायटी)", slug: "fertilizer-token-booking", fee: 0, charge: 30 },
      { name: "Fertilizer Booking", nameHi: "उर्वरक ऑनलाइन बुकिंग", slug: "fertilizer-online-booking", fee: 0, charge: 40 },
      { name: "Seed Subsidy", nameHi: "प्रमाणित बीज अनुदान आवेदन", slug: "seed-subsidy-application", fee: 0, charge: 60 },
      { name: "Farm Machinery Subsidy", nameHi: "कृषि यंत्र अनुदान आवेदन", slug: "farm-machinery-subsidy", fee: 0, charge: 80 },
      { name: "e-Krishi Yantra", nameHi: "ई-कृषि यंत्र डीबीटी पोर्टल पंजीयन", slug: "e-krishi-yantra-registration", fee: 0, charge: 80 },
      { name: "Solar Pump Subsidy", nameHi: "पीएम कुसुम सोलर पंप सब्सिडी", slug: "solar-pump-subsidy", fee: 0, charge: 100 },
      { name: "Drip/Sprinkler Subsidy", nameHi: "ड्रिप एवं स्प्रिंकलर सिंचाई सब्सिडी", slug: "drip-sprinkler-subsidy", fee: 0, charge: 80 },
      { name: "Fencing Subsidy", nameHi: "तारबंदी अनुदान योजना आवेदन", slug: "fencing-subsidy-application", fee: 0, charge: 80 },
      { name: "Horticulture Subsidy", nameHi: "उद्यानिकी फल व सब्जी अनुदान", slug: "horticulture-subsidy", fee: 0, charge: 80 },
      { name: "Dairy Subsidy", nameHi: "डेयरी फार्मिंग व पशुपालन सब्सिडी", slug: "dairy-subsidy-application", fee: 0, charge: 100 },
      { name: "Poultry Subsidy", nameHi: "कुक्कुट पालन अनुदान", slug: "poultry-subsidy-application", fee: 0, charge: 100 },
      { name: "Goat Farming Subsidy", nameHi: "बकरी पालन योजना अनुदान", slug: "goat-farming-subsidy", fee: 0, charge: 100 },
      { name: "Fisheries Subsidy", nameHi: "मत्स्य पालन योजना सब्सिडी", slug: "fisheries-subsidy", fee: 0, charge: 100 },
      { name: "Animal Husbandry Services", nameHi: "पशुधन टीकाकरण व बीमा सेवाएँ", slug: "animal-husbandry-services", fee: 0, charge: 50 }
    ]
  },
  {
    id: 9,
    slug: 'health',
    name: 'Health & Disability Services',
    nameHi: 'स्वास्थ्य एवं दिव्यांग सेवाएँ',
    icon: 'HeartPulse',
    order: 9,
    description: 'Ayushman Bharat card, ABHA ID, UDID disability card & e-Sanjeevani',
    descriptionHi: 'आयुष्मान भारत कार्ड, आभा हेल्थ आईडी, यूडीआईडी दिव्यांग प्रमाण पत्र',
    services: [
      { name: "Ayushman Card", nameHi: "आयुष्मान भारत कार्ड (PM-JAY)", slug: "ayushman-card-application", fee: 0, charge: 50 },
      { name: "Ayushman Eligibility Check", nameHi: "आयुष्मान पात्रता जांच", slug: "ayushman-eligibility-check", fee: 0, charge: 20 },
      { name: "Ayushman Family Search", nameHi: "आयुष्मान परिवार खोजें", slug: "ayushman-family-search", fee: 0, charge: 20 },
      { name: "Ayushman Card Download", nameHi: "आयुष्मान कार्ड डाउनलोड", slug: "ayushman-card-download", fee: 0, charge: 30 },
      { name: "Ayushman Hospital Search", nameHi: "संबद्ध अस्पताल खोजें (PM-JAY)", slug: "ayushman-hospital-search", fee: 0, charge: 20 },
      { name: "ABHA Health ID", nameHi: "आभा (ABHA) हेल्थ कार्ड निर्माण", slug: "abha-health-id", fee: 0, charge: 40 },
      { name: "Health Record Linking", nameHi: "स्वास्थ्य रिकॉर्ड लिंकिंग", slug: "health-record-linking", fee: 0, charge: 30 },
      { name: "e-Sanjeevani", nameHi: "ई-संजीवनी टेलीमेडिसिन डॉक्टर परामर्श", slug: "e-sanjeevani-consultation", fee: 0, charge: 40 },
      { name: "Hospital Appointment", nameHi: "एम्स / सरकारी अस्पताल ऑनलाइन ओपीडी पर्चा", slug: "hospital-appointment-ors", fee: 0, charge: 40 },
      { name: "Health Scheme Status", nameHi: "स्वास्थ्य योजना सहायता स्थिति", slug: "health-scheme-status", fee: 0, charge: 25 },
      { name: "Disability Certificate", nameHi: "दिव्यांगता प्रमाण पत्र आवेदन", slug: "disability-certificate-swavlamban", fee: 0, charge: 60 },
      { name: "UDID Card", nameHi: "विशिष्ट दिव्यांगता पहचान पत्र (UDID)", slug: "udid-card-application", fee: 0, charge: 60 },
      { name: "UDID Renewal", nameHi: "UDID कार्ड नवीनीकरण", slug: "udid-renewal", fee: 0, charge: 50 },
      { name: "Lost UDID Card", nameHi: "गुमशुदा UDID कार्ड प्रति", slug: "lost-udid-card", fee: 0, charge: 40 },
      { name: "UDID Application Tracking", nameHi: "UDID आवेदन स्थिति ट्रैकिंग", slug: "udid-application-tracking", fee: 0, charge: 20 },
      { name: "Paramedical Registration", nameHi: "पैरामेडिकल काउंसिल पंजीयन", slug: "paramedical-registration", fee: 500, charge: 150 },
      { name: "Nursing/Medical Registration", nameHi: "नर्सिंग व मेडिकल काउंसिल पंजीयन", slug: "nursing-medical-registration", fee: 1000, charge: 200 },
      { name: "Vaccination Information", nameHi: "टीकाकरण प्रमाण पत्र (CoWIN/U-WIN)", slug: "vaccination-information-download", fee: 0, charge: 25 },
      { name: "Blood Bank Search", nameHi: "ई-रक्तकोश ब्लड बैंक खोजें", slug: "blood-bank-search", fee: 0, charge: 20 },
      { name: "Health Complaint", nameHi: "स्वास्थ्य सेवा संबंधी शिकायत", slug: "health-complaint", fee: 0, charge: 30 }
    ]
  },
  {
    id: 10,
    slug: 'education',
    name: 'Education & Scholarship Services',
    nameHi: 'शिक्षा एवं छात्रवृत्ति सेवाएँ',
    icon: 'GraduationCap',
    order: 10,
    description: 'School/College admissions, MP Board forms, scholarship schemes & entrance exams',
    descriptionHi: 'कॉलेज/स्कूल प्रवेश, छात्रवृत्ति आवेदन, बोर्ड परीक्षा फॉर्म व मार्कशीट',
    services: [
      { name: "School Admission", nameHi: "आरटीई (RTE) निशुल्क स्कूल प्रवेश", slug: "rte-school-admission", fee: 0, charge: 60 },
      { name: "Student Profile", nameHi: "शिक्षा पोर्टल विद्यार्थी प्रोफाइल पंजीयन", slug: "student-profile-registration", fee: 0, charge: 40 },
      { name: "Transfer Certificate", nameHi: "स्थानांतरण प्रमाण पत्र (TC) आवेदन", slug: "transfer-certificate-request", fee: 0, charge: 40 },
      { name: "Student Character Certificate", nameHi: "विद्यार्थी चरित्र प्रमाण पत्र", slug: "student-character-certificate", fee: 0, charge: 40 },
      { name: "School Fee Payment", nameHi: "स्कूल फीस ऑनलाइन भुगतान", slug: "school-fee-payment", fee: 0, charge: 30 },
      { name: "MP Board Exam Form", nameHi: "एमपी बोर्ड 10वीं/12वीं परीक्षा फॉर्म", slug: "mp-board-exam-form", fee: 900, charge: 70 },
      { name: "MP Board Result", nameHi: "एमपी बोर्ड परीक्षा परिणाम", slug: "mp-board-result", fee: 0, charge: 20 },
      { name: "MP Board Admit Card", nameHi: "एमपी बोर्ड प्रवेश पत्र", slug: "mp-board-admit-card", fee: 0, charge: 25 },
      { name: "Duplicate Marksheet", nameHi: "डुप्लीकेट अंकसूची आवेदन (MPBSE)", slug: "duplicate-marksheet-mpbse", fee: 300, charge: 80 },
      { name: "Duplicate Certificate", nameHi: "डुप्लीकेट सनद प्रमाण पत्र", slug: "duplicate-certificate-mpbse", fee: 300, charge: 80 },
      { name: "Migration Certificate", nameHi: "प्रवजन प्रमाण पत्र (Migration)", slug: "migration-certificate", fee: 400, charge: 80 },
      { name: "Revaluation", nameHi: "उत्तरपुस्तिका पुनर्मूल्यांकन (री-चेकिंग)", slug: "revaluation-retotaling", fee: 200, charge: 50 },
      { name: "Supplementary Exam", nameHi: "पूरक परीक्षा (Supplementary) फॉर्म", slug: "supplementary-exam-form", fee: 350, charge: 60 },
      { name: "College Admission", nameHi: "महाविद्यालय प्रवेश (e-Pravesh)", slug: "college-admission-mp", fee: 100, charge: 80 },
      { name: "UG Admission", nameHi: "स्नातक (BA/B.Sc/B.Com) प्रवेश", slug: "ug-admission-epravesh", fee: 100, charge: 80 },
      { name: "PG Admission", nameHi: "स्नातकोत्तर (MA/M.Sc/M.Com) प्रवेश", slug: "pg-admission-epravesh", fee: 100, charge: 80 },
      { name: "LLB Admission", nameHi: "विधि (LLB/LLM) प्रवेश काउंसलिंग", slug: "llb-admission-counselling", fee: 150, charge: 80 },
      { name: "NCTE Admission", nameHi: "बी.एड / एम.एड / बी.पी.एड प्रवेश", slug: "ncte-bed-admission", fee: 250, charge: 80 },
      { name: "e-Pravesh Counselling", nameHi: "ई-प्रवेश ऑनलाइन चॉइस फिलिंग", slug: "e-pravesh-counselling", fee: 50, charge: 60 },
      { name: "Allotment Letter", nameHi: "कॉलेज सीट आवंटन पत्र डाउनलोड", slug: "college-allotment-letter", fee: 0, charge: 30 },
      { name: "MP Scholarship", nameHi: "एमपी छात्रवृत्ति 2.0 पंजीयन", slug: "mp-scholarship-portal", fee: 0, charge: 60 },
      { name: "SC Scholarship", nameHi: "अनुसूचित जाति पोस्ट मैट्रिक छात्रवृत्ति", slug: "sc-scholarship-mp", fee: 0, charge: 60 },
      { name: "ST Scholarship", nameHi: "अनुसूचित जनजाति छात्रवृत्ति (ट्राइबल)", slug: "st-scholarship-mp", fee: 0, charge: 60 },
      { name: "OBC Scholarship", nameHi: "अन्य पिछड़ा वर्ग छात्रवृत्ति", slug: "obc-scholarship-mp", fee: 0, charge: 60 },
      { name: "Post-Matric Scholarship", nameHi: "पोस्ट-मैट्रिक छात्रवृत्ति फॉर्म", slug: "post-matric-scholarship", fee: 0, charge: 60 },
      { name: "Pre-Matric Scholarship", nameHi: "प्री-मैट्रिक (कक्षा 9-10) छात्रवृत्ति", slug: "pre-matric-scholarship", fee: 0, charge: 40 },
      { name: "National Scholarship Portal", nameHi: "राष्ट्रीय छात्रवृत्ति पोर्टल (NSP)", slug: "national-scholarship-portal", fee: 0, charge: 70 },
      { name: "Hostel Application", nameHi: "शासकीय छात्रावास आवेदन", slug: "hostel-application-mp", fee: 0, charge: 50 },
      { name: "ITI Admission", nameHi: "आईटीआई (ITI) ऑनलाइन काउंसलिंग", slug: "iti-admission-counselling", fee: 100, charge: 70 },
      { name: "Polytechnic Admission", nameHi: "पॉलिटेक्निक (PPT) काउंसलिंग", slug: "polytechnic-admission-ppt", fee: 400, charge: 80 },
      { name: "D.El.Ed Admission", nameHi: "डी.एल.एड प्रवेश काउंसलिंग", slug: "deled-admission-counselling", fee: 200, charge: 80 },
      { name: "CUET Form", nameHi: "सीयूईटी (CUET UG/PG) आवेदन", slug: "cuet-entrance-form", fee: 750, charge: 100 },
      { name: "NEET Form", nameHi: "नीट (NEET) मेडिकल प्रवेश फॉर्म", slug: "neet-entrance-form", fee: 1700, charge: 120 },
      { name: "JEE Form", nameHi: "जेईई मेन (JEE Main) इंजीनियरिंग फॉर्म", slug: "jee-main-form", fee: 1000, charge: 120 },
      { name: "UPSC/SSC/Railway Education Forms", nameHi: "शैक्षणिक प्रतियोगी परीक्षा फॉर्म", slug: "education-competitive-forms", fee: 100, charge: 80 }
    ]
  },
  {
    id: 11,
    slug: 'jobs-exams',
    name: 'Government Jobs & Examination Services',
    nameHi: 'सरकारी नौकरी एवं परीक्षा सेवाएँ',
    icon: 'Briefcase',
    order: 11,
    description: 'MPPSC, MPESB, SSC, Railway, UPSC, admit cards, answer keys & results',
    descriptionHi: 'सरकारी भर्ती फॉर्म, प्रवेश पत्र, उत्तर कुंजी, परिणाम और सिलेबस',
    services: [
      { name: "MPPSC Forms", nameHi: "एमपीपीएससी (MPPSC) राज्य सेवा भर्ती", slug: "mppsc-recruitment-forms", fee: 500, charge: 100 },
      { name: "MPESB Forms", nameHi: "एमपी ईएसबी (व्यापम) भर्ती फॉर्म", slug: "mpesb-vyapam-forms", fee: 500, charge: 80 },
      { name: "Police Recruitment", nameHi: "मध्य प्रदेश पुलिस आरक्षक/एसआई भर्ती", slug: "mp-police-recruitment", fee: 500, charge: 80 },
      { name: "Patwari Recruitment", nameHi: "पटवारी एवं राजस्व विभाग भर्ती", slug: "patwari-recruitment", fee: 500, charge: 80 },
      { name: "Teacher Recruitment", nameHi: "शिक्षक पात्रता परीक्षा (वर्ग 1, 2, 3)", slug: "mp-teacher-recruitment", fee: 600, charge: 80 },
      { name: "Group 1/2/3/4 Recruitment", nameHi: "संयुक्त ग्रुप 1, 2, 3, 4 भर्ती", slug: "group-1-2-3-4-recruitment", fee: 500, charge: 80 },
      { name: "Subedar/ASI Recruitment", nameHi: "सूबेदार व सहायक उपनिरीक्षक भर्ती", slug: "subedar-asi-recruitment", fee: 500, charge: 80 },
      { name: "Forest Recruitment", nameHi: "वनरक्षक व क्षेत्ररक्षक भर्ती", slug: "mp-forest-guard-recruitment", fee: 500, charge: 80 },
      { name: "Jail Recruitment", nameHi: "जेल प्रहरी भर्ती", slug: "mp-jail-prahari-recruitment", fee: 500, charge: 80 },
      { name: "Health Recruitment", nameHi: "स्वास्थ्य विभाग एवं एनएचएम भर्ती", slug: "nhm-health-recruitment", fee: 500, charge: 80 },
      { name: "Court Recruitment", nameHi: "उच्च न्यायालय एवं जिला न्यायालय भर्ती", slug: "high-court-district-court-recruitment", fee: 500, charge: 80 },
      { name: "Municipal Recruitment", nameHi: "नगर पालिका एवं नगर निगम भर्ती", slug: "municipal-corporation-recruitment", fee: 500, charge: 80 },
      { name: "Railway Recruitment", nameHi: "रेलवे (RRB/RRC) एनटीपीसी व ग्रुप डी भर्ती", slug: "railway-rrb-rrc-recruitment", fee: 500, charge: 80 },
      { name: "SSC Recruitment", nameHi: "कर्मचारी चयन आयोग (CGL, CHSL, MTS, GD)", slug: "ssc-recruitment-forms", fee: 100, charge: 70 },
      { name: "UPSC Recruitment", nameHi: "संघ लोक सेवा आयोग (सिविल सेवा/NDA/CDS)", slug: "upsc-recruitment-forms", fee: 100, charge: 80 },
      { name: "Banking Recruitment", nameHi: "बैंक भर्ती (IBPS/SBI/PO/Clerk)", slug: "banking-ibps-sbi-recruitment", fee: 850, charge: 80 },
      { name: "India Post/GDS", nameHi: "इंडिया पोस्ट ग्रामीण डाक सेवक (GDS) भर्ती", slug: "india-post-gds-recruitment", fee: 100, charge: 60 },
      { name: "Army/Navy/Air Force Recruitment", nameHi: "अग्निवीर (सेना, नौसेना, वायुसेना) भर्ती", slug: "agniveer-defence-recruitment", fee: 250, charge: 80 },
      { name: "Admit Card", nameHi: "प्रवेश पत्र (Admit Card) डाउनलोड", slug: "admit-card-download-service", fee: 0, charge: 30 },
      { name: "Answer Key", nameHi: "उत्तर कुंजी (Answer Key) डाउनलोड", slug: "answer-key-download-service", fee: 0, charge: 30 },
      { name: "Answer Key Objection", nameHi: "उत्तर कुंजी आपत्ति दर्ज करें", slug: "answer-key-objection-service", fee: 50, charge: 50 },
      { name: "Result", nameHi: "परीक्षा परिणाम (Result) जांच", slug: "exam-result-check-service", fee: 0, charge: 25 },
      { name: "Scorecard", nameHi: "स्कोरकार्ड / अंकतालिका डाउनलोड", slug: "exam-scorecard-download", fee: 0, charge: 25 },
      { name: "Cut-off", nameHi: "कट-ऑफ मार्क्स विवरण", slug: "exam-cutoff-details", fee: 0, charge: 20 },
      { name: "Merit List", nameHi: "मेरिट सूची डाउनलोड", slug: "exam-merit-list-download", fee: 0, charge: 25 },
      { name: "Document Verification", nameHi: "दस्तावेज़ सत्यापन (DV) सहायता", slug: "document-verification-assistance", fee: 0, charge: 80 },
      { name: "Counselling", nameHi: "भर्ती काउंसलिंग व चॉइस फिलिंग", slug: "recruitment-counselling-choice-filling", fee: 0, charge: 80 },
      { name: "Job Notification PDF", nameHi: "आधिकारिक भर्ती विज्ञापन PDF", slug: "job-notification-pdf-download", fee: 0, charge: 20 },
      { name: "Syllabus", nameHi: "परीक्षा पाठ्यक्रम (Syllabus)", slug: "exam-syllabus-download", fee: 0, charge: 20 },
      { name: "Previous Year Papers", nameHi: "विगत वर्षों के प्रश्न पत्र (Old Papers)", slug: "previous-year-papers-download", fee: 0, charge: 20 }
    ]
  },
  {
    id: 12,
    slug: 'labour',
    name: 'Employment & Labour Services',
    nameHi: 'रोजगार एवं श्रम सेवाएँ',
    icon: 'HardHat',
    order: 12,
    description: 'MP Employment exchange, e-Shram, PF/EPF claim, ESIC & labour card',
    descriptionHi: 'रोजगार पंजीयन, ई-श्रम कार्ड, पीएफ निकासी, संबल व श्रमिक डायरी',
    services: [
      { name: "MP Employment Exchange", nameHi: "मध्य प्रदेश रोजगार पंजीयन", slug: "mp-employment-exchange", fee: 0, charge: 50 },
      { name: "Job Seeker Registration", nameHi: "जॉब सीकर पंजीयन व प्रोफाइल", slug: "job-seeker-registration", fee: 0, charge: 50 },
      { name: "Employment Renewal", nameHi: "रोजगार पंजीयन 3 वर्षीय नवीनीकरण", slug: "employment-renewal-mp", fee: 0, charge: 40 },
      { name: "Resume Creation", nameHi: "बायोडाटा / रिज्यूमे निर्माण", slug: "resume-creation-service", fee: 0, charge: 60 },
      { name: "Private Job Application", nameHi: "निजी क्षेत्र जॉब आवेदन सहायता", slug: "private-job-application-assistance", fee: 0, charge: 60 },
      { name: "e-Shram Registration", nameHi: "ई-श्रम कार्ड नया पंजीयन", slug: "e-shram-registration", fee: 0, charge: 50 },
      { name: "e-Shram Card Download", nameHi: "ई-श्रम कार्ड डाउनलोड", slug: "e-shram-card-download", fee: 0, charge: 30 },
      { name: "e-Shram Correction", nameHi: "ई-श्रम कार्ड सुधार / संशोधन", slug: "e-shram-correction", fee: 0, charge: 40 },
      { name: "UAN Activation", nameHi: "पीएफ यूएएन (UAN) एक्टिवेशन", slug: "uan-activation-service", fee: 0, charge: 50 },
      { name: "PF Passbook", nameHi: "ईपीएफओ पासबुक डाउनलोड", slug: "pf-passbook-download", fee: 0, charge: 40 },
      { name: "PF KYC", nameHi: "पीएफ बैंक व पैन ई-केवाईसी", slug: "pf-kyc-update", fee: 0, charge: 60 },
      { name: "PF Transfer", nameHi: "पीएफ बैलेंस ऑनलाइन ट्रांसफर", slug: "pf-transfer-service", fee: 0, charge: 80 },
      { name: "PF Withdrawal", nameHi: "पीएफ निकासी (Form 19, 10C, 31 Advance)", slug: "pf-withdrawal-claim", fee: 0, charge: 150 },
      { name: "EPF Claim Status", nameHi: "पीएफ क्लेम स्थिति जांच", slug: "epf-claim-status-check", fee: 0, charge: 30 },
      { name: "ESIC Registration", nameHi: "ईएसआईसी (ESIC) कर्मचारी पंजीयन", slug: "esic-registration", fee: 0, charge: 80 },
      { name: "ESIC Card", nameHi: "ईएसआईसी पहचान कार्ड डाउनलोड", slug: "esic-pehchan-card", fee: 0, charge: 40 },
      { name: "Labour Card", nameHi: "श्रमिक कार्ड / लेबर कार्ड (कर्मकार मंडल)", slug: "labour-card-mp", fee: 0, charge: 70 },
      { name: "Construction Worker Registration", nameHi: "भवन एवं संनिर्माण कर्मकार पंजीयन", slug: "construction-worker-registration", fee: 0, charge: 70 },
      { name: "Labour Welfare Schemes", nameHi: "संबल योजना पंजीयन (Sambal 2.0)", slug: "sambal-yojana-registration", fee: 0, charge: 60 },
      { name: "Factory Registration", nameHi: "कारखाना पंजीयन आवेदन", slug: "factory-registration-mp", fee: 1000, charge: 300 },
      { name: "Factory Renewal", nameHi: "कारखाना लाइसेंस नवीनीकरण", slug: "factory-renewal-mp", fee: 1000, charge: 250 },
      { name: "Shop and Establishment Registration", nameHi: "दुकान एवं स्थापना पंजीयन (गुमाश्ता)", slug: "shop-establishment-gumasta", fee: 250, charge: 150 },
      { name: "Contractor Licence", nameHi: "श्रम ठेकेदार लाइसेंस", slug: "labour-contractor-licence", fee: 1000, charge: 300 },
      { name: "Apprenticeship Registration", nameHi: "अप्रेंटिसशिप पोर्टल पंजीयन (NAPS)", slug: "apprenticeship-registration-naps", fee: 0, charge: 60 },
      { name: "Skill Training Registration", nameHi: "प्रधानमंत्री कौशल विकास योजना (PMKVY)", slug: "skill-training-registration-pmkvy", fee: 0, charge: 50 }
    ]
  },
  {
    id: 13,
    slug: 'business',
    name: 'Business, GST & MSME Services',
    nameHi: 'Business, GST एवं MSME सेवाएँ',
    icon: 'Store',
    order: 13,
    description: 'Udyam/MSME, GST registration, returns, shop licence (Gumasta) & company setup',
    descriptionHi: 'उद्यम पंजीयन, जीएसटी रजिस्ट्रेशन व रिटर्न, गुमाश्ता लाइसेंस',
    services: [
      { name: "Business PAN", nameHi: "व्यापारिक / कंपनी पैन कार्ड", slug: "business-pan-card", fee: 107, charge: 120 },
      { name: "Udyam/MSME Registration", nameHi: "उद्यम / एमएसएमई पंजीयन प्रमाण पत्र", slug: "udyam-msme-registration", fee: 0, charge: 120 },
      { name: "GST Registration", nameHi: "नया जीएसटी (GST) पंजीयन", slug: "gst-registration-service", fee: 0, charge: 350 },
      { name: "GST Amendment", nameHi: "जीएसटी संशोधन / सुधार", slug: "gst-amendment-service", fee: 0, charge: 200 },
      { name: "GST Cancellation", nameHi: "जीएसटी सरेंडर / कैंसिलेशन", slug: "gst-cancellation-service", fee: 0, charge: 250 },
      { name: "GST Return", nameHi: "जीएसटी रिटर्न फाइलिंग (GSTR-1, 3B, CMP-08)", slug: "gst-return-filing", fee: 0, charge: 200 },
      { name: "GST Payment", nameHi: "जीएसटी चालान भुगतान", slug: "gst-challan-payment", fee: 0, charge: 50 },
      { name: "GST Notice Reply", nameHi: "जीएसटी नोटिस जवाब तैयारी", slug: "gst-notice-reply-assistance", fee: 0, charge: 300 },
      { name: "e-Way Bill", nameHi: "ई-वे बिल (e-Way Bill) निर्माण", slug: "eway-bill-generation", fee: 0, charge: 60 },
      { name: "e-Invoice", nameHi: "ई-इनवॉइसिंग पोर्टल सहायता", slug: "e-invoice-assistance", fee: 0, charge: 80 },
      { name: "FSSAI Services", nameHi: "खाद्य व्यापार लाइसेंस सेवाएँ", slug: "fssai-business-services", fee: 100, charge: 150 },
      { name: "Gumasta/Shop Licence", nameHi: "गुमाश्ता लाइसेंस (शहरी व ग्रामीण)", slug: "gumasta-shop-licence-service", fee: 250, charge: 150 },
      { name: "Trade Licence", nameHi: "व्यापारिक ट्रेड लाइसेंस", slug: "trade-licence-business", fee: 500, charge: 150 },
      { name: "Partnership Firm Registration", nameHi: "पार्टनरशिप फर्म पंजीयन", slug: "partnership-firm-registration", fee: 500, charge: 400 },
      { name: "Society Registration", nameHi: "सोसायटी व समिति पंजीयन (फर्म्स एवं संस्थाएं)", slug: "society-registration-mp", fee: 1000, charge: 500 },
      { name: "NGO Registration", nameHi: "एनजीओ / ट्रस्ट पंजीयन (नीति आयोग दर्पण)", slug: "ngo-darpan-registration", fee: 0, charge: 400 },
      { name: "Private Limited Company Registration", nameHi: "प्राइवेट लिमिटेड कंपनी इनकॉर्पोरेशन", slug: "pvt-ltd-company-registration", fee: 2000, charge: 1000 },
      { name: "LLP Registration", nameHi: "एलएलपी (LLP) पंजीयन", slug: "llp-registration-service", fee: 1500, charge: 800 },
      { name: "MCA Filing", nameHi: "कंपनी मामलों का मंत्रालय (MCA) एनुअल फाइलिंग", slug: "mca-filing-service", fee: 500, charge: 500 },
      { name: "Director KYC", nameHi: "डायरेक्टर डिन (DIN) केवाईसी (DIR-3 KYC)", slug: "director-kyc-service", fee: 0, charge: 150 },
      { name: "DSC", nameHi: "डिजिटल सिग्नेचर सर्टिफिकेट (Class 3 DSC)", slug: "dsc-digital-signature", fee: 1200, charge: 300 },
      { name: "Trademark Registration", nameHi: "ट्रेडमार्क पंजीयन आवेदन", slug: "trademark-registration-service", fee: 4500, charge: 1000 },
      { name: "IEC/Import-Export Code", nameHi: "आयात-निर्यात कोड (IEC Code)", slug: "iec-import-export-code", fee: 500, charge: 350 },
      { name: "GeM Seller Registration", nameHi: "गवर्नमेंट ई-मार्केटप्लेस (GeM) विक्रेता पंजीयन", slug: "gem-seller-registration", fee: 0, charge: 300 },
      { name: "Government Tender", nameHi: "सरकारी ई-टेंडर पोर्टल पंजीयन व बिड सहायता", slug: "government-etender-assistance", fee: 0, charge: 500 },
      { name: "ISO Application", nameHi: "आईएसओ 9001 सर्टिफिकेशन मार्गदर्शन", slug: "iso-certification-application", fee: 2500, charge: 500 },
      { name: "Business Bank Account", nameHi: "चालू खाता (Current Account) दस्तावेज तैयारी", slug: "current-account-opening-assistance", fee: 0, charge: 150 },
      { name: "Loan Document Preparation", nameHi: "मुद्रा / पीएमईजीपी लोन प्रोजेक्ट रिपोर्ट", slug: "loan-project-report-preparation", fee: 0, charge: 500 },
      { name: "Invoice Creation", nameHi: "व्यावसायिक बिल / इनवॉइस निर्माण", slug: "invoice-creation-service", fee: 0, charge: 40 },
      { name: "Quotation Creation", nameHi: "कोटेशन व एस्टीमेट ड्राफ्टिंग", slug: "quotation-creation-service", fee: 0, charge: 40 }
    ]
  },
  {
    id: 14,
    slug: 'banking',
    name: 'Banking, AEPS & Insurance Services',
    nameHi: 'बैंकिंग, AEPS एवं बीमा सेवाएँ',
    icon: 'Landmark',
    order: 14,
    description: 'Bank account opening assistance, DBT status, PMJJBY, PMSBY, APY & LIC premium',
    descriptionHi: 'बैंक खाता सहायता, आधार डीबीटी, जीवन ज्योति बीमा, सुरक्षा बीमा, अटल पेंशन',
    services: [
      { name: "Bank Account Opening Assistance", nameHi: "जीरो बैलेंस बचत खाता सहायता", slug: "bank-account-opening-assistance", fee: 0, charge: 60 },
      { name: "KYC Update", nameHi: "बैंक खाता केवाईसी अद्यतन", slug: "bank-kyc-update-assistance", fee: 0, charge: 40 },
      { name: "Mobile/Email Update", nameHi: "बैंक में मोबाइल व ईमेल अपडेट", slug: "bank-mobile-email-update-form", fee: 0, charge: 40 },
      { name: "Nominee Update", nameHi: "बैंक खाता नॉमिनी संशोधन", slug: "bank-nominee-update", fee: 0, charge: 40 },
      { name: "Passbook/Statement", nameHi: "बैंक खाता स्टेटमेंट डाउनलोड", slug: "bank-statement-download", fee: 0, charge: 30 },
      { name: "Cheque Book", nameHi: "चेक बुक आवेदन सहायता", slug: "cheque-book-request", fee: 0, charge: 30 },
      { name: "Account Closure", nameHi: "बैंक खाता बंद करने का आवेदन", slug: "account-closure-request", fee: 0, charge: 40 },
      { name: "UPI Setup", nameHi: "यूपीआई (PhonePe/GPay/Paytm) सेटअप सहायता", slug: "upi-setup-assistance", fee: 0, charge: 30 },
      { name: "UPI Complaint", nameHi: "यूपीआई असफल भुगतान शिकायत", slug: "upi-failed-payment-complaint", fee: 0, charge: 30 },
      { name: "AEPS Cash Withdrawal", nameHi: "आधार एटीएम (AEPS) नकद निकासी", slug: "aeps-cash-withdrawal", fee: 0, charge: 20 },
      { name: "AEPS Balance Enquiry", nameHi: "आधार बैलेंस इन्क्वायरी", slug: "aeps-balance-enquiry", fee: 0, charge: 10 },
      { name: "Mini Statement", nameHi: "आधार मिनी स्टेटमेंट", slug: "aeps-mini-statement", fee: 0, charge: 20 },
      { name: "Domestic Money Transfer", nameHi: "घरेलू मनी ट्रांसफर (DMT)", slug: "domestic-money-transfer", fee: 0, charge: 30 },
      { name: "Bill Payment", nameHi: "बीबीपीएस (BBPS) बिल भुगतान", slug: "bbps-bill-payment-service", fee: 0, charge: 20 },
      { name: "DBT Status", nameHi: "आधार बैंक डीबीटी लिंकिंग स्थिति", slug: "dbt-aadhaar-bank-linking-status", fee: 0, charge: 25 },
      { name: "Aadhaar-Bank Linking", nameHi: "आधार बैंक खाता लिंकिंग फॉर्म", slug: "aadhaar-bank-linking-form", fee: 0, charge: 40 },
      { name: "LIC Premium Payment", nameHi: "एलआईसी (LIC) पॉलिसी प्रीमियम भुगतान", slug: "lic-premium-payment", fee: 0, charge: 30 },
      { name: "LIC Policy Status", nameHi: "एलआईसी पॉलिसी स्थिति व रसीद", slug: "lic-policy-status-check", fee: 0, charge: 25 },
      { name: "Insurance Payment", nameHi: "साधारण व वाहन बीमा प्रीमियम", slug: "insurance-payment-general", fee: 0, charge: 30 },
      { name: "PMJJBY", nameHi: "प्रधानमंत्री जीवन ज्योति बीमा योजना (₹2 लाख)", slug: "pmjjby-insurance-scheme", fee: 436, charge: 40 },
      { name: "PMSBY", nameHi: "प्रधानमंत्री सुरक्षा बीमा योजना (₹2 लाख दुर्घटना बीमा)", slug: "pmsby-insurance-scheme", fee: 20, charge: 20 },
      { name: "Atal Pension Yojana", nameHi: "अटल पेंशन योजना (APY) पंजीयन", slug: "atal-pension-yojana", fee: 0, charge: 50 },
      { name: "Loan Application Assistance", nameHi: "सरकारी लोन आवेदन सहायता (मुद्रा/PMEGP)", slug: "loan-application-assistance", fee: 0, charge: 150 },
      { name: "Credit Card Assistance", nameHi: "क्रेडिट कार्ड आवेदन मार्गदर्शन", slug: "credit-card-assistance", fee: 0, charge: 80 },
      { name: "Credit Report Guidance", nameHi: "सिबिल / क्रेडिट स्कोर रिपोर्ट डाउनलोड", slug: "credit-report-guidance", fee: 0, charge: 40 }
    ]
  },
  {
    id: 15,
    slug: 'utilities',
    name: 'Recharge, Bill & Utility Services',
    nameHi: 'रिचार्ज, बिल एवं यूटिलिटी सेवाएँ',
    icon: 'Zap',
    order: 15,
    description: 'Electricity bill, mobile recharge, DTH, broadband, water & gas bill payment',
    descriptionHi: 'बिजली बिल भुगतान, मोबाइल व डीटीएच रिचार्ज, गैस बिल',
    services: [
      { name: "Mobile Recharge", nameHi: "मोबाइल प्रीपेड रिचार्ज", slug: "mobile-recharge-service", fee: 0, charge: 10 },
      { name: "Mobile Postpaid Bill", nameHi: "मोबाइल पोस्टपेड बिल भुगतान", slug: "mobile-postpaid-bill-payment", fee: 0, charge: 20 },
      { name: "Broadband Bill", nameHi: "ब्रॉडबैंड / वाई-फाई बिल भुगतान", slug: "broadband-bill-payment", fee: 0, charge: 20 },
      { name: "DTH Recharge", nameHi: "डीटीएच (Tata Play, Airtel, Dish TV) रिचार्ज", slug: "dth-recharge-service", fee: 0, charge: 15 },
      { name: "Electricity Bill", nameHi: "मध्य प्रदेश बिजली बिल भुगतान (पूर्व/मध्य/पश्चिम क्षेत्र)", slug: "electricity-bill-payment", fee: 0, charge: 20 },
      { name: "New Electricity Connection", nameHi: "नया घरेलू/व्यावसायिक बिजली कनेक्शन", slug: "new-electricity-connection", fee: 0, charge: 80 },
      { name: "Electricity Load Change", nameHi: "बिजली कनेक्शन लोड वृद्धि/कमी", slug: "electricity-load-change", fee: 0, charge: 60 },
      { name: "Electricity Name Transfer", nameHi: "बिजली मीटर नाम परिवर्तन", slug: "electricity-name-transfer", fee: 0, charge: 70 },
      { name: "Meter Complaint", nameHi: "बिजली मीटर खराब/तेज चलने की शिकायत", slug: "meter-complaint", fee: 0, charge: 30 },
      { name: "Electricity Bill Correction", nameHi: "अत्यधिक बिजली बिल सुधार आवेदन", slug: "electricity-bill-correction", fee: 0, charge: 40 },
      { name: "Water Bill", nameHi: "जल प्रदाय बिल भुगतान", slug: "water-bill-payment", fee: 0, charge: 20 },
      { name: "Gas Bill", nameHi: "पाइप्ड प्राकृतिक गैस (PNG) बिल भुगतान", slug: "piped-gas-bill-payment", fee: 0, charge: 20 },
      { name: "FASTag Recharge", nameHi: "फास्टैग तत्काल ऑनलाइन रिचार्ज", slug: "fastag-online-recharge-utility", fee: 0, charge: 20 },
      { name: "Insurance Bill", nameHi: "बीमा प्रीमियम ऑनलाइन भुगतान", slug: "insurance-bill-payment", fee: 0, charge: 25 },
      { name: "Loan EMI Payment", nameHi: "लोन ईएमआई ऑनलाइन भुगतान", slug: "loan-emi-payment", fee: 0, charge: 30 },
      { name: "Credit Card Bill Payment", nameHi: "क्रेडिट कार्ड बिल तत्काल भुगतान", slug: "credit-card-bill-payment", fee: 0, charge: 30 },
      { name: "Receipt Download", nameHi: "बिल भुगतान आधिकारिक रसीद डाउनलोड", slug: "utility-receipt-download", fee: 0, charge: 15 },
      { name: "Payment History", nameHi: "उपभोक्ता भुगतान इतिहास विवरण", slug: "utility-payment-history", fee: 0, charge: 20 }
    ]
  },
  {
    id: 16,
    slug: 'travel',
    name: 'Travel, Ticket & Courier Services',
    nameHi: 'यात्रा, टिकट एवं कूरियर सेवाएँ',
    icon: 'Plane',
    order: 16,
    description: 'IRCTC rail tickets, bus/flight booking assistance, Speed Post tracking & courier',
    descriptionHi: 'ट्रेन टिकट बुकिंग, बस व हवाई टिकट, स्पीड पोस्ट ट्रैकिंग व कूरियर',
    services: [
      { name: "IRCTC Registration", nameHi: "आईआरसीटीसी (IRCTC) नया खाता पंजीयन", slug: "irctc-registration", fee: 0, charge: 50 },
      { name: "Train Ticket Booking", nameHi: "ट्रेन टिकट ऑनलाइन बुकिंग सहायता", slug: "train-ticket-booking", fee: 0, charge: 40 },
      { name: "Tatkal Ticket Assistance", nameHi: "तत्काल ट्रेन टिकट बुकिंग सहायता", slug: "tatkal-ticket-assistance", fee: 0, charge: 70 },
      { name: "PNR Status", nameHi: "ट्रेन पीएनआर (PNR) स्थिति जांच", slug: "pnr-status-check", fee: 0, charge: 15 },
      { name: "Ticket Cancellation", nameHi: "ट्रेन टिकट रद्दीकरण व रिफंड", slug: "ticket-cancellation-assistance", fee: 0, charge: 30 },
      { name: "Refund Status", nameHi: "आईआरसीटीसी रिफंड स्थिति जांच", slug: "refund-status-check", fee: 0, charge: 20 },
      { name: "Bus Ticket Booking", nameHi: "ऑनलाइन बस टिकट बुकिंग (RedBus/MPSRTC)", slug: "bus-ticket-booking", fee: 0, charge: 30 },
      { name: "Flight Booking Assistance", nameHi: "हवाई जहाज (फ्लाइट) टिकट बुकिंग", slug: "flight-booking-assistance", fee: 0, charge: 80 },
      { name: "Hotel Booking", nameHi: "होटल व धर्मशाला ऑनलाइन बुकिंग", slug: "hotel-booking-assistance", fee: 0, charge: 50 },
      { name: "MP Tourism Booking", nameHi: "मध्य प्रदेश पर्यटन होटल व सफारी बुकिंग", slug: "mp-tourism-booking", fee: 0, charge: 60 },
      { name: "Speed Post Tracking", nameHi: "स्पीड पोस्ट / रजिस्ट्री ट्रैकिंग", slug: "speed-post-tracking", fee: 0, charge: 15 },
      { name: "Courier Tracking", nameHi: "निजी कूरियर ट्रैकिंग (DTDC/BlueDart/Delhivery)", slug: "courier-tracking-service", fee: 0, charge: 15 }
    ]
  },
  {
    id: 17,
    slug: 'tools',
    name: 'Document & Photo Tools',
    nameHi: 'Document एवं Photo Tools',
    icon: 'Scan',
    order: 17,
    description: 'PDF convert, compress, crop photo/sign, typing, print, scan, lamination',
    descriptionHi: 'पीडीएफ टूल्स, फोटो/हस्ताक्षर रिसाइज़, टंकण, प्रिंट, स्कैन और लेमिनेशन',
    services: [
      { name: "JPG to PDF", nameHi: "फोटो से पीडीएफ बनाएं (JPG to PDF)", slug: "jpg-to-pdf-tool", fee: 0, charge: 20 },
      { name: "PDF to JPG", nameHi: "पीडीएफ से फोटो निकालें (PDF to JPG)", slug: "pdf-to-jpg-tool", fee: 0, charge: 20 },
      { name: "PDF Merge", nameHi: "कई पीडीएफ को एक करें (PDF Merge)", slug: "pdf-merge-tool", fee: 0, charge: 25 },
      { name: "PDF Split", nameHi: "पीडीएफ पेज अलग करें (PDF Split)", slug: "pdf-split-tool", fee: 0, charge: 20 },
      { name: "PDF Compress", nameHi: "पीडीएफ साइज छोटा करें (100KB/200KB Compress)", slug: "pdf-compress-tool", fee: 0, charge: 25 },
      { name: "PDF Rotate", nameHi: "पीडीएफ सीधा करें (Rotate)", slug: "pdf-rotate-tool", fee: 0, charge: 15 },
      { name: "PDF Watermark", nameHi: "पीडीएफ में वाटरमार्क लगाएं", slug: "pdf-watermark-tool", fee: 0, charge: 25 },
      { name: "PDF Scan", nameHi: "दस्तावेज़ मोबाइल स्कैन पीडीएफ", slug: "pdf-scan-tool", fee: 0, charge: 20 },
      { name: "Passport Photo", nameHi: "पासपोर्ट साइज फोटो निर्माण (6/12/36 प्रतियों में)", slug: "passport-photo-tool", fee: 0, charge: 40 },
      { name: "Signature Crop", nameHi: "हस्ताक्षर क्रॉप व बैकग्राउंड क्लीन", slug: "signature-crop-tool", fee: 0, charge: 25 },
      { name: "Image Resize", nameHi: "इमेज रिसाइज़ (सेंटीमीटर/इंच/पिक्सल)", slug: "image-resize-tool", fee: 0, charge: 20 },
      { name: "Image Compression", nameHi: "इमेज साइज छोटा करें (KB Reduce)", slug: "image-compression-tool", fee: 0, charge: 20 },
      { name: "Government Pixel/KB Resize", nameHi: "सरकारी फॉर्म अनुसार फोटो/हस्ताक्षर सेट करना", slug: "government-pixel-kb-resize", fee: 0, charge: 30 },
      { name: "Document Straighten", nameHi: "टेढ़े दस्तावेज़ को सीधा करें", slug: "document-straighten-tool", fee: 0, charge: 25 },
      { name: "OCR", nameHi: "इमेज से टेक्स्ट निकालें (OCR)", slug: "ocr-text-extract-tool", fee: 0, charge: 30 },
      { name: "Hindi-English Typing", nameHi: "हिंदी व अंग्रेजी टंकण कार्य", slug: "hindi-english-typing-tool", fee: 0, charge: 30 },
      { name: "Resume Creation", nameHi: "आकर्षक बायोडाटा / रिज्यूमे निर्माण", slug: "resume-creation-tool", fee: 0, charge: 60 },
      { name: "Affidavit", nameHi: "शपथ पत्र प्रारूपण (नोटरी / ई-स्टाम्प)", slug: "affidavit-drafting-tool", fee: 50, charge: 70 },
      { name: "Application Letter", nameHi: "विभागीय शिकायत व आवेदन पत्र लेखन", slug: "application-letter-tool", fee: 0, charge: 40 },
      { name: "Certificate Design", nameHi: "प्रमाण पत्र प्रारूप डिजाइन", slug: "certificate-design-tool", fee: 0, charge: 70 },
      { name: "Print", nameHi: "ब्लैक & व्हाइट एवं कलर फोटो प्रिंट", slug: "print-service-pds", fee: 0, charge: 10 },
      { name: "Scan", nameHi: "हाई-रेजोल्यूशन कलर स्कैनिंग", slug: "scan-service-pds", fee: 0, charge: 10 },
      { name: "Photocopy", nameHi: "ज़ेरॉक्स / फोटोकॉपी सेवा", slug: "photocopy-service-pds", fee: 0, charge: 5 },
      { name: "Lamination", nameHi: "दस्तावेज़ एवं कार्ड लेमिनेशन", slug: "lamination-service-pds", fee: 0, charge: 20 }
    ]
  }
];

// Helper to determine department, URLs, documents based on category & name
function getServiceMetadata(cat, s) {
  let department = "Madhya Pradesh / Government of India Public Services";
  let departmentHi = "मध्य प्रदेश शासन / भारत सरकार लोक सेवा";
  let officialWebsiteUrl = "https://pradhandigitalservices.in";
  let directApplyUrl = "https://pradhandigitalservices.in";
  let helpline = "181 / 1947";
  let officialSource = "Official Citizen Services Portal";
  let reqDocs = ["आधार कार्ड (Aadhaar Card)", "मोबाइल नंबर (Active Mobile Number)"];
  let processingTime = "1-3 Days";
  let processingTimeHi = "1-3 कार्य दिवस";

  const lower = s.name.toLowerCase();

  if (cat.slug === 'identity') {
    if (lower.includes('aadhaar') || lower.includes('vid')) {
      department = "Unique Identification Authority of India (UIDAI)";
      departmentHi = "भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI)";
      officialWebsiteUrl = "https://uidai.gov.in";
      directApplyUrl = "https://myaadhaar.uidai.gov.in";
      helpline = "1947";
      officialSource = "UIDAI Citizen Portal";
      reqDocs = ["आधार नंबर / नामांकन पर्ची", "आधार लिंक मोबाइल नंबर (OTP हेतु)", "पहचान व पते का प्रमाण"];
    } else if (lower.includes('pan')) {
      department = "Income Tax Department (Protean / NSDL / UTIITSL)";
      departmentHi = "आयकर विभाग (Protean / NSDL / UTIITSL)";
      officialWebsiteUrl = "https://www.incometax.gov.in";
      directApplyUrl = "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html";
      helpline = "1800 180 1961";
      officialSource = "Income Tax e-Filing Portal";
      reqDocs = ["आधार कार्ड", "पासपोर्ट साइज फोटो", "हस्ताक्षर"];
      processingTime = "3-7 Days";
      processingTimeHi = "3-7 कार्य दिवस";
    } else if (lower.includes('voter') || lower.includes('epic') || lower.includes('polling')) {
      department = "Election Commission of India (ECI)";
      departmentHi = "भारत निर्वाचन आयोग (ECI)";
      officialWebsiteUrl = "https://voters.eci.gov.in";
      directApplyUrl = "https://voters.eci.gov.in";
      helpline = "1950";
      officialSource = "ECI Voters Service Portal";
      reqDocs = ["आधार कार्ड", "आयु प्रमाण (10वीं अंकसूची/जन्म प्रमाण)", "पासपोर्ट फोटो", "निवास प्रमाण"];
      processingTime = "7-15 Days";
      processingTimeHi = "7-15 कार्य दिवस";
    } else if (lower.includes('samagra') || lower.includes('mayke')) {
      department = "Social Justice & Disabled Welfare Dept (Samagra MP)";
      departmentHi = "सामाजिक न्याय एवं दिव्यांगजन सशक्तिकरण विभाग (समग्र मध्य प्रदेश)";
      officialWebsiteUrl = "https://samagra.gov.in";
      directApplyUrl = "https://samagra.gov.in";
      helpline = "0755-2700800";
      officialSource = "Samagra Samajik Suraksha Mission";
      reqDocs = ["समग्र परिवार आईडी", "आधार कार्ड", "मोबाइल नंबर", "राशन कार्ड या 10वीं अंकसूची"];
    } else if (lower.includes('digilocker') || lower.includes('umang') || lower.includes('abc') || lower.includes('apaar')) {
      department = "Ministry of Electronics & IT (MeitY) / Ministry of Education";
      departmentHi = "इलेक्ट्रॉनिक्स एवं सूचना प्रौद्योगिकी मंत्रालय / शिक्षा मंत्रालय";
      officialWebsiteUrl = "https://www.digilocker.gov.in";
      directApplyUrl = "https://www.digilocker.gov.in";
      helpline = "1800 11 0031";
      officialSource = "Digital India Platform";
      reqDocs = ["आधार कार्ड", "आधार लिंक मोबाइल नंबर (OTP)", "शैक्षणिक विवरण"];
    }
  } else if (cat.slug === 'certificates') {
    department = "MP Public Service Guarantee (Lok Seva Kendra MP)";
    departmentHi = "लोक सेवा प्रबंधन विभाग (मध्य प्रदेश शासन)";
    officialWebsiteUrl = "http://mpedistrict.gov.in";
    directApplyUrl = "http://mpedistrict.gov.in/MPL/Home.aspx";
    helpline = "0755-2773824 / 181";
    officialSource = "MP e-District Portal";
    reqDocs = ["समग्र सदस्य आईडी", "आधार कार्ड", "स्वप्रमाणित घोषणा पत्र", "पासपोर्ट फोटो", "भूमि/निवास संबंधी प्रमाण"];
    processingTime = "3-7 Days";
    processingTimeHi = "3-7 कार्य दिवस";
  } else if (cat.slug === 'ration-food') {
    if (lower.includes('fssai')) {
      department = "Food Safety and Standards Authority of India (FSSAI)";
      departmentHi = "भारतीय खाद्य सुरक्षा एवं मानक प्राधिकरण (FSSAI)";
      officialWebsiteUrl = "https://foscos.fssai.gov.in";
      directApplyUrl = "https://foscos.fssai.gov.in";
      helpline = "1800 11 2100";
      officialSource = "FoSCoS Portal";
      reqDocs = ["व्यापारी आधार व पैन", "दुकान/प्रतिष्ठान का पता प्रमाण", "पासपोर्ट फोटो", "घोषणा पत्र"];
    } else if (lower.includes('lpg') || lower.includes('gas')) {
      department = "Ministry of Petroleum & Natural Gas (IOCL/BPCL/HPCL)";
      departmentHi = "पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय (Indane/Bharat/HP Gas)";
      officialWebsiteUrl = "https://www.pmuy.gov.in";
      directApplyUrl = "https://my.ebharatgas.com";
      helpline = "1800 2333 555 / 1906";
      officialSource = "LPG Official Portal";
      reqDocs = ["आधार कार्ड", "राशन कार्ड", "बैंक पासबुक", "पासपोर्ट फोटो"];
    } else {
      department = "Food, Civil Supplies & Consumer Protection Dept MP";
      departmentHi = "खाद्य, नागरिक आपूर्ति एवं उपभोक्ता संरक्षण विभाग (मध्य प्रदेश)";
      officialWebsiteUrl = "https://rationmitra.nic.in";
      directApplyUrl = "https://rationmitra.nic.in";
      helpline = "181 / 1967";
      officialSource = "MP Ration Mitra Portal";
      reqDocs = ["समग्र परिवार आईडी", "सभी सदस्यों के आधार कार्ड", "बैंक पासबुक", "जाति/बीपीएल प्रमाण पत्र"];
    }
  } else if (cat.slug === 'rto-vehicle') {
    department = "Ministry of Road Transport & Highways (Parivahan Sewa)";
    departmentHi = "सड़क परिवहन एवं राजमार्ग मंत्रालय (परिवहन सेवा)";
    officialWebsiteUrl = "https://parivahan.gov.in";
    directApplyUrl = "https://sarathi.parivahan.gov.in";
    helpline = "0120-4925505 / 1033";
    officialSource = "Parivahan Sarathi & Vahan Portal";
    reqDocs = ["आधार कार्ड", "आयु प्रमाण (10वीं मार्कशीट)", "पता प्रमाण", "पासपोर्ट फोटो व हस्ताक्षर", "वाहन बीमा/प्रदूषण"];
    processingTime = "3-15 Days";
    processingTimeHi = "3-15 कार्य दिवस";
  } else if (cat.slug === 'passport-police') {
    if (lower.includes('passport') || lower.includes('pcc')) {
      department = "Ministry of External Affairs (Consular, Passport & Visa Division)";
      departmentHi = "विदेश मंत्रालय (पासपोर्ट सेवा केंद्र)";
      officialWebsiteUrl = "https://www.passportindia.gov.in";
      directApplyUrl = "https://www.passportindia.gov.in";
      helpline = "1800 258 1800";
      officialSource = "Passport Seva Portal";
      reqDocs = ["आधार कार्ड", "10वीं अंकसूची (DOB Proof)", "पैन कार्ड", "वर्तमान पता प्रमाण (बैंक पासबुक/बिजली बिल)"];
      processingTime = "7-20 Days";
      processingTimeHi = "7-20 कार्य दिवस";
    } else if (lower.includes('court') || lower.includes('legal') || lower.includes('cause')) {
      department = "e-Courts Mission Mode Project / NALSA";
      departmentHi = "न्याय विभाग (ई-कोर्ट्स मिशन / नालसा)";
      officialWebsiteUrl = "https://ecourts.gov.in";
      directApplyUrl = "https://services.ecourts.gov.in";
      helpline = "15100";
      officialSource = "e-Courts Services Portal";
      reqDocs = ["केस नंबर / सीएनआर नंबर (CNR)", "पक्षकारों के नाम", "वकालतनामा"];
    } else {
      department = "Madhya Pradesh Police / Ministry of Home Affairs (CCTNS)";
      departmentHi = "मध्य प्रदेश पुलिस / गृह मंत्रालय (CCTNS / Citizen Portal)";
      officialWebsiteUrl = "https://mppolice.gov.in";
      directApplyUrl = "https://citizen.mppolice.gov.in";
      helpline = "112 / 1930";
      officialSource = "MP Police Citizen Portal";
      reqDocs = ["आधार कार्ड", "मोबाइल नंबर", "घटना विवरण / खोए दस्तावेज का विवरण", "फोटो"];
    }
  } else if (cat.slug === 'municipal') {
    department = "Urban Development and Housing Department MP (e-Nagar Palika)";
    departmentHi = "नगरीय विकास एवं आवास विभाग (ई-नगर पालिका मध्य प्रदेश)";
    officialWebsiteUrl = "https://www.mpenagarpalika.gov.in";
    directApplyUrl = "https://www.mpenagarpalika.gov.in";
    helpline = "1800 233 5555 / 181";
    officialSource = "e-Nagar Palika MP Portal";
    reqDocs = ["संपत्ति आईडी / नल कनेक्शन नंबर", "आधार कार्ड", "रजिस्ट्री की प्रति / भवन अनुज्ञा", "मोबाइल नंबर"];
  } else if (cat.slug === 'land-revenue') {
    if (lower.includes('sampada') || lower.includes('registry') || lower.includes('stamp')) {
      department = "Commercial Tax Department MP (Inspector General of Registration - Sampada 2.0)";
      departmentHi = "पंजीयन एवं मुद्रांक विभाग (म.प्र. संपदा 2.0 पोर्टल)";
      officialWebsiteUrl = "https://mpigr.gov.in";
      directApplyUrl = "https://sampada.mpigr.gov.in";
      helpline = "0755-2578501";
      officialSource = "MP IGR Sampada Portal";
      reqDocs = ["विक्रेता व क्रेता आधार, पैन", "खसरा नकल व बी-1", "गवाहों के आधार कार्ड", "पासपोर्ट फोटो"];
    } else {
      department = "Revenue Department MP (MP Bhulekh / RCMS)";
      departmentHi = "राजस्व विभाग मध्य प्रदेश (एमपी भू-अभिलेख / आरसीएमएस)";
      officialWebsiteUrl = "https://mpbhulekh.gov.in";
      directApplyUrl = "https://mpbhulekh.gov.in";
      helpline = "0755-4291600";
      officialSource = "MP Bhulekh Portal";
      reqDocs = ["जिला, तहसील, ग्राम एवं खसरा नंबर", "भूस्वामी का नाम", "आधार कार्ड"];
    }
  } else if (cat.slug === 'agriculture') {
    if (lower.includes('pm-kisan')) {
      department = "Ministry of Agriculture & Farmers Welfare (PM-KISAN)";
      departmentHi = "कृषि एवं किसान कल्याण मंत्रालय (पीएम किसान सम्मान निधि)";
      officialWebsiteUrl = "https://pmkisan.gov.in";
      directApplyUrl = "https://pmkisan.gov.in";
      helpline = "155261 / 011-24300606";
      officialSource = "PM Kisan Samman Nidhi Portal";
      reqDocs = ["आधार कार्ड", "जमीन की खतौनी / खसरा नकल", "बैंक पासबुक", "आधार लिंक मोबाइल नंबर"];
    } else if (lower.includes('uparjan')) {
      department = "Food Supplies & Agriculture Dept MP (e-Uparjan)";
      departmentHi = "खाद्य नागरिक आपूर्ति एवं कृषि विभाग (ई-उपार्जन मध्य प्रदेश)";
      officialWebsiteUrl = "https://mpeuparjan.nic.in";
      directApplyUrl = "https://mpeuparjan.nic.in";
      helpline = "181 / 0755-2551472";
      officialSource = "MP e-Uparjan Portal";
      reqDocs = ["समग्र सदस्य आईडी", "आधार कार्ड", "खसरा नकल", "बैंक पासबुक (Aadhaar Seeded)"];
    } else {
      department = "Farmer Welfare & Agriculture Development Dept MP";
      departmentHi = "किसान कल्याण तथा कृषि विकास विभाग (मध्य प्रदेश)";
      officialWebsiteUrl = "https://dbt.mpdage.org";
      directApplyUrl = "https://dbt.mpdage.org";
      helpline = "0755-2766324 / 181";
      officialSource = "MP Krishi Yantra & DBT Portal";
      reqDocs = ["खसरा बी-1 नकल", "आधार कार्ड", "बैंक पासबुक", "जाति प्रमाण (यदि लागू हो)"];
    }
  } else if (cat.slug === 'health') {
    if (lower.includes('ayushman') || lower.includes('abha')) {
      department = "National Health Authority (NHA) / PM-JAY Ayushman Bharat";
      departmentHi = "राष्ट्रीय स्वास्थ्य प्राधिकरण (आयुष्मान भारत PM-JAY)";
      officialWebsiteUrl = "https://beneficiary.nha.gov.in";
      directApplyUrl = "https://beneficiary.nha.gov.in";
      helpline = "14555 / 1800 111 565";
      officialSource = "NHA Beneficiary Portal";
      reqDocs = ["समग्र परिवार आईडी या राशन कार्ड", "आधार कार्ड", "बायोमेट्रिक या आधार ओटीपी"];
    } else if (lower.includes('udid') || lower.includes('disability')) {
      department = "Department of Empowerment of Persons with Disabilities (Swavlamban)";
      departmentHi = "दिव्यांगजन सशक्तिकरण विभाग (स्वावलंबन कार्ड UDID)";
      officialWebsiteUrl = "https://www.swavlambancard.gov.in";
      directApplyUrl = "https://www.swavlambancard.gov.in";
      helpline = "011-24365019";
      officialSource = "Unique Disability ID Portal";
      reqDocs = ["आधार कार्ड", "दिव्यांगता चिकित्सा प्रमाण पत्र (CMO Certificate)", "पासपोर्ट फोटो", "निवास प्रमाण"];
    } else {
      department = "Public Health and Family Welfare Department MP";
      departmentHi = "लोक स्वास्थ्य एवं परिवार कल्याण विभाग (मध्य प्रदेश)";
      officialWebsiteUrl = "https://health.mp.gov.in";
      directApplyUrl = "https://health.mp.gov.in";
      helpline = "104 / 108";
      officialSource = "MP Health Portal";
      reqDocs = ["आधार कार्ड", "रजिस्ट्रेशन विवरण / मरीज पर्ची"];
    }
  } else if (cat.slug === 'education') {
    department = "School & Higher Education Department MP / National Scholarship Portal";
    departmentHi = "स्कूल व उच्च शिक्षा विभाग (म.प्र.) / राष्ट्रीय छात्रवृत्ति पोर्टल";
    officialWebsiteUrl = "https://scholarshipportal.mp.nic.in";
    directApplyUrl = "https://epravesh.mponline.gov.in";
    helpline = "0755-2551698 / 181";
    officialSource = "MP e-Pravesh & Scholarship Portal";
    reqDocs = ["समग्र आईडी", "आधार कार्ड", "पिछली कक्षा की अंकसूची", "आय, जाति व मूल निवासी प्रमाण पत्र", "बैंक पासबुक"];
  } else if (cat.slug === 'jobs-exams') {
    department = "Staff Selection / MPESB / MPPSC / UPSC / Railway Recruitment";
    departmentHi = "मध्य प्रदेश कर्मचारी चयन मंडल / लोक सेवा आयोग / एसएससी / रेलवे";
    officialWebsiteUrl = "https://esb.mp.gov.in";
    directApplyUrl = "https://mponline.gov.in";
    helpline = "0755-2578801";
    officialSource = "Official Recruitment Portals";
    reqDocs = ["व्यापम प्रोफाइल पंजीयन / आधार कार्ड", "10वीं/12वीं/स्नातक अंकसूची", "पासपोर्ट फोटो (नाम व दिनांक सहित)", "हस्ताक्षर"];
  } else if (cat.slug === 'labour') {
    if (lower.includes('shram')) {
      department = "Ministry of Labour and Employment (e-Shram Portal)";
      departmentHi = "श्रम एवं रोजगार मंत्रालय (ई-श्रम पोर्टल)";
      officialWebsiteUrl = "https://eshram.gov.in";
      directApplyUrl = "https://register.eshram.gov.in";
      helpline = "14434";
      officialSource = "e-Shram Citizen Portal";
      reqDocs = ["आधार कार्ड", "आधार लिंक मोबाइल नंबर", "बैंक खाता विवरण"];
    } else if (lower.includes('pf') || lower.includes('uan') || lower.includes('epf')) {
      department = "Employees' Provident Fund Organisation (EPFO)";
      departmentHi = "कर्मचारी भविष्य निधि संगठन (EPFO)";
      officialWebsiteUrl = "https://www.epfindia.gov.in";
      directApplyUrl = "https://unifiedportal-mem.epfindia.gov.in/memberinterface/";
      helpline = "1800 118 005";
      officialSource = "EPFO Member Portal";
      reqDocs = ["UAN नंबर", "पासवर्ड", "आधार लिंक मोबाइल नंबर", "बैंक कैंसल चेक / पासबुक"];
    } else {
      department = "Labour Department MP (MP Rojgar / Sambal)";
      departmentHi = "श्रम विभाग मध्य प्रदेश (एमपी रोजगार / संबल 2.0)";
      officialWebsiteUrl = "https://mprojgar.gov.in";
      directApplyUrl = "https://mprojgar.gov.in";
      helpline = "181 / 0755-2761706";
      officialSource = "MP Rojgar Portal";
      reqDocs = ["समग्र सदस्य आईडी", "आधार कार्ड", "शैक्षणिक योग्यता विवरण", "मोबाइल नंबर"];
    }
  } else if (cat.slug === 'business') {
    if (lower.includes('gst')) {
      department = "Goods and Services Tax Network (GSTN)";
      departmentHi = "वस्तु एवं सेवा कर नेटवर्क (जीएसटीएन)";
      officialWebsiteUrl = "https://www.gst.gov.in";
      directApplyUrl = "https://www.gst.gov.in";
      helpline = "1800 103 4786";
      officialSource = "GST Official Portal";
      reqDocs = ["पैन कार्ड", "आधार कार्ड", "व्यापार स्थल बिजली बिल / किरायानामा", "बैंक खाता प्रमाण", "पासपोर्ट फोटो"];
    } else if (lower.includes('udyam') || lower.includes('msme')) {
      department = "Ministry of Micro, Small and Medium Enterprises (MSME)";
      departmentHi = "सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (उद्यम पंजीयन)";
      officialWebsiteUrl = "https://udyamregistration.gov.in";
      directApplyUrl = "https://udyamregistration.gov.in";
      helpline = "011-23063288";
      officialSource = "Udyam Registration Portal";
      reqDocs = ["आधार कार्ड (उद्यमी का)", "पैन कार्ड", "बैंक खाता विवरण", "व्यापारिक जानकारी"];
    } else {
      department = "Ministry of Corporate Affairs (MCA) / Commerce Dept MP";
      departmentHi = "कॉर्पोरेट कार्य मंत्रालय / वाणिज्य एवं उद्योग विभाग";
      officialWebsiteUrl = "https://www.mca.gov.in";
      directApplyUrl = "https://www.mca.gov.in";
      helpline = "0120-4832500";
      officialSource = "MCA21 Portal";
      reqDocs = ["पैन कार्ड", "आधार कार्ड", "पते का प्रमाण", "बैंक विवरण"];
    }
  } else if (cat.slug === 'banking') {
    department = "National Payments Corporation of India (NPCI) & Banking System";
    departmentHi = "भारतीय राष्ट्रीय भुगतान निगम (NPCI) व बैंकिंग प्रणाली";
    officialWebsiteUrl = "https://www.npci.org.in";
    directApplyUrl = "https://www.npci.org.in";
    helpline = "1800 120 1740";
    officialSource = "NPCI & Citizen Banking Assistance";
    reqDocs = ["आधार कार्ड", "पैन कार्ड", "पासपोर्ट साइज फोटो", "मोबाइल नंबर"];
  } else if (cat.slug === 'utilities') {
    department = "MP Electricity Distribution / Bharat BillPay (BBPS)";
    departmentHi = "म.प्र. विद्युत वितरण कंपनी / भारत बिलपे (BBPS)";
    officialWebsiteUrl = "https://www.mpcz.in";
    directApplyUrl = "https://www.bharatbillpay.com";
    helpline = "1912 / 0755-2551222";
    officialSource = "MP Vidyut Vitran & BBPS Portal";
    reqDocs = ["उपभोक्ता क्रमांक (IVRS / Account ID)", "मोबाइल नंबर"];
  } else if (cat.slug === 'travel') {
    department = "Indian Railways (IRCTC) / Department of Posts (India Post)";
    departmentHi = "भारतीय रेल (IRCTC) / डाक विभाग (इंडिया पोस्ट)";
    officialWebsiteUrl = "https://www.irctc.co.in";
    directApplyUrl = "https://www.irctc.co.in";
    helpline = "139 / 1800 266 6868";
    officialSource = "IRCTC & India Post Portal";
    reqDocs = ["यात्री का नाम, आयु, लिंग", "पहचान पत्र (आधार / वोटर / पैन)", "मोबाइल नंबर"];
  } else if (cat.slug === 'tools') {
    department = "Pradhan Digital Services Document Processing Desk";
    departmentHi = "प्रधान डिजिटल सर्विसेज प्रपत्र व दस्तावेज सहायता केंद्र";
    officialWebsiteUrl = "https://pradhandigitalservices.in";
    directApplyUrl = "https://pradhandigitalservices.in/document-tools";
    helpline = "+91 9294899787";
    officialSource = "PDS In-House Digital Studio & Processing System";
    reqDocs = ["मूल दस्तावेज़ / डिजिटल कॉपी (Original or Scanned Copy)"];
    processingTime = "Instant / 30 Minutes";
    processingTimeHi = "तत्काल / 30 मिनट";
  }

  return {
    department,
    departmentHi,
    officialWebsiteUrl,
    directApplyUrl,
    officialHelpline: helpline,
    officialSource,
    requiredDocuments: reqDocs,
    processingTime,
    processingTimeHi
  };
}

export function buildComprehensiveCatalogue() {
  const allServices = [];
  const slugsSeen = new Set();

  for (const cat of CATEGORIES_CONFIG) {
    for (const s of cat.services) {
      let slug = s.slug;
      if (slugsSeen.has(slug)) {
        slug = `${cat.slug}-${slug}`;
      }
      slugsSeen.add(slug);

      const meta = getServiceMetadata(cat, s);
      const totalFee = (s.fee || 0) + (s.charge || 40);

      const item = {
        name: s.name,
        nameHi: s.nameHi,
        slug,
        category: cat.slug,
        subcategory: cat.name,
        description: `Complete online assistance, verification, drafting and portal submission for ${s.name} at Pradhan Digital Services.`,
        descriptionHi: `प्रधान डिजिटल सर्विसेज के माध्यम से ${s.nameHi} हेतु संपूर्ण ऑनलाइन सहायता, दस्तावेज़ सत्यापन एवं अधिकृत पोर्टल पर त्वरित आवेदन।`,
        icon: cat.icon,
        department: meta.department,
        departmentHi: meta.departmentHi,
        officialWebsiteUrl: meta.officialWebsiteUrl,
        directApplyUrl: meta.directApplyUrl,
        officialHelpline: meta.officialHelpline,
        officialSource: meta.officialSource,
        governmentFee: s.fee || 0,
        serviceCharge: s.charge || 40,
        totalFee,
        price: totalFee,
        processingTime: meta.processingTime,
        processingTimeHi: meta.processingTimeHi,
        requiredDocuments: meta.requiredDocuments,
        optionalDocuments: [],
        whoCanApply: "Eligible citizens, students, farmers, businesses and residents of MP & India.",
        whoCanApplyHi: "मध्य प्रदेश एवं भारत के सभी पात्र नागरिक, विद्यार्थी, किसान व व्यवसायी।",
        eligibility: [
          "Applicant must hold required primary identification documents.",
          "Must meet designated departmental criteria for the specified service."
        ],
        eligibilityHi: [
          "आवेदक के पास आवश्यक प्राथमिक पहचान दस्तावेज होने चाहिए।",
          "संबंधित सेवा के लिए निर्धारित शासकीय पात्रता मापदंड पूर्ण हों।"
        ],
        steps: [
          "Select service and verify eligibility requirements",
          "Submit applicant details and upload necessary documents",
          "Verification by PDS certified operator",
          "Application processing on official government portal",
          "Download official receipt and reference tracking number"
        ],
        stepsHi: [
          "सेवा चुनें और आवश्यक दस्तावेजों की सूची जांचें",
          "आवेदक का विवरण दर्ज करें और दस्तावेज अपलोड करें",
          "प्रमाणित ऑपरेटर द्वारा दस्तावेजों का सत्यापन",
          "शासकीय आधिकारिक पोर्टल पर सुरक्षित आवेदन",
          "आधिकारिक आवेदन रसीद व ट्रैकिंग नंबर प्राप्त करें"
        ],
        instructions: [
          "Ensure uploaded copies are clear and all details match primary records.",
          "Government fee is paid directly to the departmental treasury as per rules.",
          "Private assistance fee covers verification, typing, scanning and digital delivery."
        ],
        instructionsHi: [
          "दस्तावेजों की साफ प्रति अपलोड करें और नाम-जन्मतिथि का मिलान अवश्य करें।",
          "शासकीय शुल्क सरकारी नियमों के अनुसार सीधे विभागीय कोष में जमा होता है।",
          "निजी सहायता शुल्क सत्यापन, टंकण, स्कैनिंग व त्वरित डिजिटल सेवा हेतु है।"
        ],
        isPopular: s.charge > 50 || s.name.includes("Aadhaar") || s.name.includes("PAN") || s.name.includes("Khasra") || s.name.includes("Certificate"),
        tags: [
          s.name.toLowerCase(),
          s.nameHi,
          cat.slug,
          "pradhan digital services",
          "online seva kendra",
          "mp online"
        ],
        isActive: true
      };

      allServices.push(item);
    }
  }

  return allServices;
}

// Generate the files
const catalogue = buildComprehensiveCatalogue();
console.log(`Successfully generated ${catalogue.length} services across 17 categories!`);

// 1. Write frontend/src/data/servicesCatalogue.ts
const frontendFileContent = `// Comprehensive Master Service Catalogue for Frontend
// Complete 17 Category Online Services for Pradhan Digital Services
// Total Services: ${catalogue.length}

export interface ServiceCatalogueItem {
  name: string;
  nameHi: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  descriptionHi: string;
  icon: string;
  department: string;
  departmentHi: string;
  officialWebsiteUrl: string;
  directApplyUrl: string;
  officialHelpline: string;
  officialSource: string;
  governmentFee: number;
  serviceCharge: number;
  totalFee: number;
  price: number;
  processingTime: string;
  processingTimeHi: string;
  requiredDocuments: string[];
  optionalDocuments: string[];
  whoCanApply: string;
  whoCanApplyHi: string;
  eligibility: string[];
  eligibilityHi: string[];
  steps: string[];
  stepsHi: string[];
  instructions: string[];
  instructionsHi: string[];
  isPopular: boolean;
  tags: string[];
  isActive: boolean;
}

export const MASTER_SERVICES: ServiceCatalogueItem[] = ${JSON.stringify(catalogue, null, 2)};
`;

fs.writeFileSync('frontend/src/data/servicesCatalogue.ts', frontendFileContent, 'utf-8');
console.log('✓ Wrote frontend/src/data/servicesCatalogue.ts');

// 2. Write backend/src/data/masterCatalogue.js
const backendFileContent = `// Comprehensive Master Service Catalogue for Backend
// Complete 17 Category Online Services for Pradhan Digital Services
// Total Services: ${catalogue.length}

export const MASTER_SERVICES = ${JSON.stringify(catalogue, null, 2)};
`;

fs.writeFileSync('backend/src/data/masterCatalogue.js', backendFileContent, 'utf-8');
console.log('✓ Wrote backend/src/data/masterCatalogue.js');

// 3. Write backend/src/data/masterCategories.js with all 17 categories
const categoriesData = CATEGORIES_CONFIG.map(c => ({
  slug: c.slug,
  name: c.name,
  nameHi: c.nameHi,
  icon: c.icon,
  order: c.order,
  description: c.description,
  descriptionHi: c.descriptionHi
}));

const backendCategoriesContent = `// 17 Master Categories for Pradhan Digital Services

export const MASTER_CATEGORIES = ${JSON.stringify(categoriesData, null, 2)};
`;

fs.writeFileSync('backend/src/data/masterCategories.js', backendCategoriesContent, 'utf-8');
console.log('✓ Wrote backend/src/data/masterCategories.js');
