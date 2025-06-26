
import React from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import DestinationGrid from '@/components/DestinationGrid';
import PlannerSection from '@/components/PlannerSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background select-none">
      <NavBar />
      <Hero />
      <DestinationGrid />
      <PlannerSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
