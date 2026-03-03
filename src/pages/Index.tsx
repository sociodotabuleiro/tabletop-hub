import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PainSection from "@/components/PainSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import QRCodeSection from "@/components/QRCodeSection";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <PainSection />
    <HowItWorks />
    <Testimonials />
    <QRCodeSection />
    <LeadCaptureForm />
    <FinalCTA />
    <Footer />
  </div>
);

export default Index;
