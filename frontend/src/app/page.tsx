import HeroSection from "@/components/home/HeroSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import QuickActions from "@/components/home/QuickActions";
import TrustBar from "@/components/home/TrustBar";
import { PopularServicesSection, AllServicesSection } from "@/components/home/ServicesSections";
import VacancySection from "@/components/home/VacancySection";
import HowItWorks from "@/components/home/HowItWorks";
import DeliverySection from "@/components/home/DeliverySection";
import PremiumAndAppSection from "@/components/home/PremiumAndAppSection";
import FormsSection from "@/components/home/FormsSection";
import RechargeSection from "@/components/home/RechargeSection";
import FAQSection from "@/components/home/FAQSection";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F6F8FC] dark:bg-navy-950 text-navy-900 dark:text-white">
      {/* C. Latest Updates Ticker */}
      <MarqueeSection />

      {/* D. Hero with original vector illustration & prominent search */}
      <HeroSection />

      {/* E. Service Categories & Quick Action Pill Cards */}
      <QuickActions />

      {/* Trust & Transparency Bar */}
      <TrustBar />

      {/* F. Popular Services with clear pricing & document criteria */}
      <PopularServicesSection />

      {/* Complete Category Catalog */}
      <AllServicesSection />

      {/* G. Vacancy Section (Open Vacancies, Admit Cards, Results -> /vacancy-update) */}
      <VacancySection />

      {/* H. How it Works (3 Clear Stages: Submitted -> Review/Pending -> Done) */}
      <HowItWorks />

      {/* I. PDF Download & Doorstep Speed Post Delivery Section */}
      <DeliverySection />

      {/* J & K. Premium Plans (Monthly/Yearly) & Real PWA Add to Home Screen Section */}
      <PremiumAndAppSection />

      {/* Offline Forms & Utility Bill Payments */}
      <FormsSection />
      <RechargeSection />

      {/* L. FAQ and Support Desk */}
      <FAQSection />
      <ContactSection />
    </main>
  );
}
