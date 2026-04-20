import React, { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STEPS = [
  {
    text: 'Analisando as proporções e o caimento...',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
    color: 'from-blue-500/30 to-purple-600/10',
  },
  {
    text: 'Ajustando a iluminação e as sombras...',
    image:
      'https://images.unsplash.com/photo-1550614000-4b95d4ed3963?q=80&w=800&auto=format&fit=crop',
    color: 'from-amber-500/30 to-orange-600/10',
  },
  {
    text: 'Ótima escolha! Essa peça combina perfeitamente.',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    color: 'from-emerald-500/30 to-teal-600/10',
  },
  {
    text: 'Dando os toques finais na imagem...',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
    color: 'from-pink-500/30 to-rose-600/10',
  },
  {
    text: 'Pronto! O resultado ficou sensacional!',
    image:
      'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=800&auto=format&fit=crop',
    color: 'from-indigo-500/30 to-cyan-600/10',
  },
];

interface TryOnLoadingModalProps {
  isVisible: boolean;
}

export const TryOnLoadingModal: React.FC<TryOnLoadingModalProps> = ({ isVisible }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');

  useEffect(() => {
    if (!isVisible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentIndex(0);

      setFadeState('fade-in');
      return;
    }

    let transitionTimeout: ReturnType<typeof setTimeout>;

    // Diminuímos para 1.5s para rotacionar as 5 imagens confortavelmente antes de a API Mock (6s) responder.
    const messageInterval = setInterval(() => {
      setFadeState('fade-out');

      transitionTimeout = setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev < STEPS.length - 1) return prev + 1;
          return prev;
        });
        setFadeState('fade-in');
      }, 400);
    }, 1500);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(transitionTimeout);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-700 ease-out p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Background Ambient Glow interativo com a transição do array de cores */}
      <div
        className={cn(
          'absolute inset-0 transition-colors duration-1000 bg-gradient-to-br opacity-50 blur-3xl z-0',
          STEPS[currentIndex].color
        )}
      ></div>

      <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-3xl flex flex-col md:flex-row items-center max-w-4xl w-full max-h-[85vh] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95 duration-500 delay-100 fill-mode-both z-10">
        {/* Painel Esquerdo: Imagens com Efeito Ken Burns (Interativo) */}
        <div className="w-full md:w-1/2 h-56 md:h-[450px] relative overflow-hidden bg-neutral-900 border-b md:border-b-0 md:border-r border-outline-variant/10">
          {STEPS.map((step, idx) => (
            <img
              key={idx}
              src={step.image}
              alt=""
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out pointer-events-none',
                idx === currentIndex
                  ? 'opacity-100 scale-105' // Anima de 1 -> 1.05 dando o efeito sútil de Ken Burns enquanto estiver ativa
                  : 'opacity-0 scale-100'
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
            {/* Um medidor visual do quão longe estamos pro fim */}
            <div className="w-full flex gap-2">
              {STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-all duration-500',
                    idx <= currentIndex ? 'bg-white' : 'bg-white/20'
                  )}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Painel Direito: Copywriting e Loading */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col items-center justify-center relative bg-surface-container-lowest/90 backdrop-blur-3xl">
          <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
            {/* Anéis Charms */}
            <div className="absolute inset-0 border-[4px] border-outline-variant/20 rounded-full"></div>
            <div className="absolute inset-0 border-[4px] border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-[2px] border-r-secondary border-t-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_2s_reverse_infinite]"></div>

            <span
              className="material-symbols-outlined text-primary animate-pulse absolute"
              style={{ fontSize: '2.5rem' }}
            >
              apparel
            </span>
          </div>

          <div className="h-24 flex items-center justify-center w-full">
            <h3
              className={cn(
                'text-center font-label md:text-lg font-bold uppercase tracking-[0.05em] text-on-surface transition-opacity duration-300 leading-relaxed',
                fadeState === 'fade-in' ? 'opacity-100' : 'opacity-0'
              )}
            >
              {STEPS[currentIndex].text}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
