'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { VideoDemoSection } from '@/components/landing/VideoDemoSection';
import { AIFlowSection } from '@/components/landing/AIFlowSection';
import { ProductOverview } from '@/components/landing/ProductOverview';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AudioDemoSection } from '@/components/landing/AudioDemoSection';
import { PainPointsSection } from '@/components/landing/PainPointsSection';
import { SocialProof } from '@/components/landing/SocialProof';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FooterCTA } from '@/components/landing/FooterCTA';

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <HeroSection />
      <VideoDemoSection />
      <AIFlowSection />
      <ProductOverview />
      <FeaturesSection />
      <AudioDemoSection />
      <PainPointsSection />
      <SocialProof />
      <PricingSection />
      <FAQSection />
      <FooterCTA />
    </main>
  );
}
