import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-xl border-none shadow-[0_40px_60px_-15px_rgba(0,0,0,0.04)] font-headline tracking-[-0.02em] antialiased">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16 py-3 flex justify-between items-center">
        <div className="text-lg font-bold tracking-[0.05em] uppercase text-neutral-900 dark:text-neutral-50">
          The Digital Atelier
        </div>
        <button className="bg-secondary text-on-secondary px-6 py-2 rounded uppercase text-[10px] tracking-[0.05em] font-medium hover:bg-secondary-container transition-colors active:scale-[0.98]">
          Login
        </button>
      </div>
    </nav>
  );
};
