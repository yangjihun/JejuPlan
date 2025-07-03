import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import DestinationGrid from '@/components/DestinationGrid';
import AboutSection from '@/components/AboutSection';
import RecentPlansSection from '@/components/RecentPlansSection';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background select-none">
      <NavBar />
      <Hero onGetStarted={() => navigate('/plans')} />
      <DestinationGrid />
      <RecentPlansSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
