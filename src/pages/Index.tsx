import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PainSection from "@/components/PainSection";
import ServicesSection from "@/components/ServicesSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import PartnersSection from "@/components/PartnersSection";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <PainSection />
    <ServicesSection />
    <HowItWorks />
    <Testimonials />
    <PartnersSection />
    <LeadCaptureForm />
    <FinalCTA />
    <Footer />
  </div>
);

export default Index;
