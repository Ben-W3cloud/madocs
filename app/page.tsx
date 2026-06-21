import ArchitectureSection from "@/components/marketing/ArchitectureSection";
import CTASection from "@/components/marketing/CTASection";
import DeveloperSection from "@/components/marketing/DeveloperSection";
import Footer from "@/components/marketing/Footer";
import FutureSection from "@/components/marketing/FutureSection";
import Header from "@/components/marketing/Header";
import Hero from "@/components/marketing/Hero";
import ProblemSection from "@/components/marketing/ProblemSection";
import SolutionSection from "@/components/marketing/SolutionSection";
import TrustSection from "@/components/marketing/TrustSection";
import ZKExplainer from "@/components/marketing/ZKExplainer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <ZKExplainer />
        <DeveloperSection />
        <ArchitectureSection />
        <TrustSection />
        <FutureSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
