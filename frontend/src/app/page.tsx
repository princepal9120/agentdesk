'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { PainPointsSection } from '@/components/landing/PainPointsSection';
import { ProductOverview } from '@/components/landing/ProductOverview';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AudioDemoSection } from '@/components/landing/AudioDemoSection';
import { AIFlowSection } from '@/components/landing/AIFlowSection';
import { SocialProof } from '@/components/landing/SocialProof';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FooterCTA } from '@/components/landing/FooterCTA';

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <HeroSection />
      <PainPointsSection />
      <ProductOverview />
      <FeaturesSection />
      <AudioDemoSection />
      <AIFlowSection />
      <SocialProof />
      <PricingSection />
      <FAQSection />
      <FooterCTA />
    </main>
  );
}
