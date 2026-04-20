import React from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { Footer } from '../components/Footer';
import { WidgetView } from '../components/WidgetView';

export const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 pb-24 px-8 md:px-16 max-w-screen-xl mx-auto w-full flex flex-col min-h-screen">
        <HeroSection />
        <WidgetView />
      </main>
      <Footer />
    </>
  );
};
