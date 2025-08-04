import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import CallToAction from "@/components/sections/CallToAction";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <CallToAction />
      <FAQ />
      <Footer />
    </div>
  );
}
