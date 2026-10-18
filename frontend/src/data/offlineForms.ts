export type OfflineForm = {
  id: string;
  name: string;
  nameHi: string;
  slug: string;
  description: string;
  descriptionHi: string;
  category: string;
  price: number;
  fileSize?: string;
  state?: string;
  department?: string;
  language?: string;
  updated?: string;
  preview?: string;
};

export const offlineForms: OfflineForm[] = [
  { id: "income-form", name: "Income Certificate Form", nameHi: "आय प्रमाण पत्र फॉर्म", slug: "income-certificate-form", description: "Download income certificate application form", descriptionHi: "आय प्रमाण पत्र आवेदन फॉर्म डाउनलोड करें", category: "Certificates", price: 5 },
  { id: "caste-form", name: "Caste Certificate Form", nameHi: "जाति प्रमाण पत्र फॉर्म", slug: "caste-certificate-form", description: "Download caste certificate application form", descriptionHi: "जाति प्रमाण पत्र आवेदन फॉर्म डाउनलोड करें", category: "Certificates", price: 5 },
  { id: "domicile-form", name: "Domicile Form", nameHi: "अधिवास फॉर्म", slug: "domicile-form", description: "Download domicile certificate form", descriptionHi: "अधिवास प्रमाण पत्र फॉर्म डाउनलोड करें", category: "Certificates", price: 5 },
  { id: "birth-form", name: "Birth Certificate Form", nameHi: "जन्म प्रमाण पत्र फॉर्म", slug: "birth-certificate-form", description: "Download birth certificate form", descriptionHi: "जन्म प्रमाण पत्र फॉर्म डाउनलोड करें", category: "Certificates", price: 5 },
  { id: "death-form", name: "Death Certificate Form", nameHi: "मृत्यु प्रमाण पत्र फॉर्म", slug: "death-certificate-form", description: "Download death certificate form", descriptionHi: "मृत्यु प्रमाण पत्र फॉर्म डाउनलोड करें", category: "Certificates", price: 5 },
  { id: "marriage-form", name: "Marriage Registration Form", nameHi: "विवाह पंजीकरण फॉर्म", slug: "marriage-registration-form", description: "Download marriage registration form", descriptionHi: "विवाह पंजीकरण फॉर्म डाउनलोड करें", category: "Certificates", price: 5 },
  { id: "pension-form", name: "Pension Forms", nameHi: "पension फॉर्म", slug: "pension-forms", description: "Download pension application forms", descriptionHi: "पension आवेदन फॉर्म डाउनलोड करें", category: "Schemes", price: 5 },
  { id: "samagra-form", name: "Samagra Forms", nameHi: "समग्र फॉर्म", slug: "samagra-forms", description: "Download Samagra ID forms", descriptionHi: "समग्र ID फॉर्म डाउनलोड करें", category: "Schemes", price: 5 },
  { id: "labour-form", name: "Labour Forms", nameHi: "श्रमिक फॉर्म", slug: "labour-forms", description: "Download labour card forms", descriptionHi: "श्रमिक कार्ड फॉर्म डाउनलोड करें", category: "Schemes", price: 5 },
  { id: "pm-kisan-form", name: "PM Kisan Forms", nameHi: "PM किसान फॉर्म", slug: "pm-kisan-forms", description: "Download PM Kisan application forms", descriptionHi: "PM किसान आवेदन फॉर्म डाउनलोड करें", category: "Schemes", price: 5 },
  { id: "mp-forms", name: "Madhya Pradesh Forms", nameHi: "मध्य प्रदेश फॉर्म", slug: "madhya-pradesh-forms", description: "All MP state government forms", descriptionHi: "सभी MP राज्य सरकारी फॉर्म", category: "State Forms", state: "Madhya Pradesh", price: 5 },
  { id: "up-forms", name: "Uttar Pradesh Forms", nameHi: "उत्तर प्रदेश फॉर्म", slug: "uttar-pradesh-forms", description: "All UP state government forms", descriptionHi: "सभी UP राज्य सरकारी फॉर्म", category: "State Forms", state: "Uttar Pradesh", price: 5 },
  { id: "rajasthan-forms", name: "Rajasthan Forms", nameHi: "राजस्थान फॉर्म", slug: "rajasthan-forms", description: "All Rajasthan state government forms", descriptionHi: "सभी राजस्थान राज्य सरकारी फॉर्म", category: "State Forms", state: "Rajasthan", price: 5 },
  { id: "bihar-forms", name: "Bihar Forms", nameHi: "बिहार फॉर्म", slug: "bihar-forms", description: "All Bihar state government forms", descriptionHi: "सभी बिहार राज्य सरकारी फॉर्म", category: "State Forms", state: "Bihar", price: 5 },
  { id: "all-state-forms", name: "All State Government Forms", nameHi: "सभी राज्य सरकारी फॉर्म", slug: "all-state-government-forms", description: "Complete collection of state government forms", descriptionHi: "राज्य सरकारी फॉर्म का संपूर्ण संग्रह", category: "State Forms", price: 5 },
];

export const FORM_DOWNLOAD_PRICE = 5;
