import HeroSection from "@/components/home/HeroSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import QuickActions from "@/components/home/QuickActions";
import TrustBar from "@/components/home/TrustBar";
import { PopularServicesSection, AllServicesSection } from "@/components/home/ServicesSections";
import VacancySection from "@/components/home/VacancySection";
import RechargeSection from "@/components/home/RechargeSection";
import FormsSection from "@/components/home/FormsSection";
import NewsSection from "@/components/home/NewsSection";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <QuickActions />
      <TrustBar />
      <PopularServicesSection />
      <AllServicesSection />
      <VacancySection />
      <RechargeSection />
      <FormsSection />
      <NewsSection />
      <HowItWorks />
      <WhyChooseUsSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
