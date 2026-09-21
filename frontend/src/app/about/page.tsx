import { ShieldCheck, Target, Users, HandHeart, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {lang === "hi" ? "हमारे बारे में" : "About Us"}
          </h1>
          <p className="text-xl text-saffron-300 mb-2">{siteConfig.name}</p>
          <p className="text-navy-300 max-w-2xl mx-auto">
            {siteConfig.tagline}
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 bg-white dark:bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-4">
              {lang === "hi" ? "हम कौन हैं" : "Who We Are"}
            </h2>
            <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
              {lang === "hi" 
                ? "प्रधान डिजिटल सेवाएं एक निजी सुविधा मंच है जो भारतीय नागरिकों को सरकारी सेवाओं, प्रमाण पत्र, ऑनलाइन फॉर्म, नौकरी अपडेट, रिचार्ज और बिल भुगतान सेवाओं तक आसान पहुंच प्रदान करता है। हम एक ऐसा मंच हैं जो उपयोगकर्ताओं को आधिकारिक सरकारी पोर्टलों के माध्यम से सेवाओं का लाभ उठाने में मदद करता है।"
                : "Pradhan Digital Services is a private facilitation platform that provides Indian citizens with easy access to government services, certificates, online forms, job updates, recharge, and bill payment services. We are a platform that helps users benefit from services through official government portals."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-saffron-500 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                {lang === "hi" ? "निजी मंच" : "Private Platform"}
              </h3>
              <p className="text-sm text-navy-600 dark:text-navy-300">
                {lang === "hi" 
                  ? "हम किसी भी सरकारी विभाग से संबद्ध या समर्थित नहीं हैं"
                  : "We are not affiliated with or endorsed by any government department"
                }
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-saffron-500 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                {lang === "hi" ? "हमारा मिशन" : "Our Mission"}
              </h3>
              <p className="text-sm text-navy-600 dark:text-navy-300">
                {lang === "hi" 
                  ? "डिजिटल सेवाओं को सभी के लिए सुलभ और आसान बनाना"
                  : "Making digital services accessible and easy for everyone"
                }
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-saffron-500 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                {lang === "hi" ? "हमारा लक्ष्य" : "Our Goal"}
              </h3>
              <p className="text-sm text-navy-600 dark:text-navy-300">
                {lang === "hi" 
                  ? "उपयोगकर्ताओं को सहायता और मार्गदर्शन प्रदान करना"
                  : "Providing assistance and guidance to users"
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-navy-50 dark:bg-navy-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 dark:text-white text-center mb-12">
            {lang === "hi" ? "हम क्या करते हैं" : "What We Do"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Government Services", titleHi: "सरकारी सेवाएं", desc: "Aadhaar, PAN, Voter ID, Passport, Driving Licence", descHi: "आधार, पैन, मतदाता पहचान पत्र, पासपोर्ट, ड्राइविंग लाइसेंस" },
              { title: "Certificates", titleHi: "प्रमाण पत्र", desc: "Income, Caste, Domicile, Birth, Death Certificates", descHi: "आय, जाति, निवास, जन्म, मृत्यु प्रमाण पत्र" },
              { title: "Government Schemes", titleHi: "सरकारी योजनाएं", desc: "Ayushman Bharat, PM Kisan, e-Shram, Pension Schemes", descHi: "आयुष्मान भारत, पीएम किसान, ई-श्रम, पेंशन योजनाएं" },
              { title: "Business Services", titleHi: "व्यवसाय सेवाएं", desc: "GST Registration, Udyam, FSSAI, Company Registration", descHi: "जीएसटी पंजीकरण, उद्यम, एफएसएसएआई, कंपनी पंजीकरण" },
              { title: "Recharge & Bills", titleHi: "रिचार्ज और बिल", desc: "Mobile, DTH, Electricity, Water, Gas Bill Payments", descHi: "मोबाइल, डीटीएच, बिजली, पानी, गैस बिल भुगतान" },
              { title: "Job Updates", titleHi: "नौकरी अपडेट", desc: "Government Jobs, Private Jobs, Admit Cards, Results", descHi: "सरकारी नौकरियां, निजी नौकरियां, प्रवेश पत्र, परिणाम" },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-white dark:bg-navy-900 rounded-2xl shadow-sm">
                <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                  {lang === "hi" ? item.titleHi : item.title}
                </h3>
                <p className="text-sm text-navy-600 dark:text-navy-300">
                  {lang === "hi" ? item.descHi : item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white dark:bg-navy-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 dark:text-white text-center mb-12">
            {lang === "hi" ? "हमें क्यों चुनें" : "Why Choose Us"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: ShieldCheck, title: "Secure", titleHi: "सुरक्षित", desc: "Safe and secure assistance", descHi: "सुरक्षित सहायता" },
              { icon: HandHeart, title: "Easy Process", titleHi: "आसान प्रक्रिया", desc: "Simple steps for everyone", descHi: "सभी के लिए सरल चरण" },
              { icon: Users, title: "Hindi Support", titleHi: "हिंदी सहायता", desc: "Complete Hindi language support", descHi: "पूर्ण हिंदी भाषा सहायता" },
              { icon: Target, title: "Transparent", titleHi: "पारदर्शी", desc: "Clear and transparent charges", descHi: "स्पष्ट और पारदर्शी शुल्क" },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-saffron-500 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                  {lang === "hi" ? item.titleHi : item.title}
                </h3>
                <p className="text-sm text-navy-600 dark:text-navy-300">
                  {lang === "hi" ? item.descHi : item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-navy-50 dark:bg-navy-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 dark:text-white text-center mb-12">
            {lang === "hi" ? "संपर्क करें" : "Contact Us"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 p-6 bg-white dark:bg-navy-900 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-saffron-500 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-navy-500 dark:text-navy-400">{lang === "hi" ? "फोन" : "Phone"}</p>
                <p className="font-semibold text-navy-900 dark:text-white">{siteConfig.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white dark:bg-navy-900 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-saffron-500 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-navy-500 dark:text-navy-400">{lang === "hi" ? "ईमेल" : "Email"}</p>
                <p className="font-semibold text-navy-900 dark:text-white">{siteConfig.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white dark:bg-navy-900 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-saffron-500 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-navy-500 dark:text-navy-400">{lang === "hi" ? "पता" : "Address"}</p>
                <p className="font-semibold text-navy-900 dark:text-white">{siteConfig.address}</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition"
            >
              {lang === "hi" ? "संपर्क फॉर्म भरें" : "Fill Contact Form"}
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-white dark:bg-navy-900 border-t border-navy-100 dark:border-navy-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto p-6 bg-navy-50 dark:bg-navy-800 rounded-xl border border-navy-200 dark:border-navy-700">
            <p className="text-sm text-navy-600 dark:text-navy-300 leading-relaxed">
              <strong className="text-saffron-600">{lang === "hi" ? "अस्वीकरण: " : "Disclaimer: "}</strong>
              {lang === "hi" ? siteConfig.disclaimer.hi : siteConfig.disclaimer.en}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
