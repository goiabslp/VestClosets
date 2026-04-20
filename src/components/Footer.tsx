import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto bg-neutral-100 dark:bg-neutral-900 border-t border-outline-variant/10 font-label text-[10px] tracking-[0.05em] uppercase font-medium">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-16 py-12 gap-6 max-w-screen-2xl mx-auto w-full">
        <div className="text-neutral-900 dark:text-neutral-50 font-bold">
          © 2026 Digital Atelier. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a
            className="text-neutral-400 dark:text-neutral-500 hover:text-secondary dark:hover:text-secondary-fixed transition-colors ease-in-out duration-300"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-neutral-400 dark:text-neutral-500 hover:text-secondary dark:hover:text-secondary-fixed transition-colors ease-in-out duration-300"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-neutral-400 dark:text-neutral-500 hover:text-secondary dark:hover:text-secondary-fixed transition-colors ease-in-out duration-300"
            href="#"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};
