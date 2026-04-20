import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="text-center mb-24">
      <h1 className="font-headline text-[3.5rem] leading-[1.1] tracking-[-0.02em] font-light mb-6 text-on-surface">
        Experimente qualquer roupa, <br />
        <span className="font-bold">digitalmente</span>
      </h1>
      <p className="font-body text-lg text-on-surface-variant max-w-2xl mx-auto mb-16 leading-relaxed">
        Utilizamos inteligência artificial avançada para sobrepor peças de vestuário em suas fotos
        com precisão milimétrica, preservando caimento, iluminação e texturas reais.
      </p>
      {/* How it Works Icons */}
      <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-24">
        {[
          { icon: 'apparel', label: 'Envie a roupa' },
          { icon: 'person', label: 'Envie sua foto' },
          { icon: 'auto_awesome', label: 'Veja a mágica' },
        ].map(({ icon, label }, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-secondary">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '2rem', fontVariationSettings: "'FILL' 0" }}
              >
                {icon}
              </span>
            </div>
            <span className="font-label text-[10px] uppercase tracking-[0.05em] font-medium text-on-surface">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
