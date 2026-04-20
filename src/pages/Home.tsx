import React from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { UploadCards } from '../components/UploadCards';
import { TryOnLoadingModal } from '../components/TryOnLoadingModal';
import { Footer } from '../components/Footer';
import { useVirtualTryOn } from '../hooks/useVirtualTryOn';

export const Home: React.FC = () => {
  const {
    clothingImage,
    modelImage,
    isProcessing,
    resultImage,
    handleSetClothing,
    handleSetModel,
    sendTryOnRequest,
    clearStates,
  } = useVirtualTryOn();

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-8 md:px-16 max-w-screen-xl mx-auto w-full flex flex-col min-h-screen">
        <HeroSection />

        {!resultImage && (
          <UploadCards
            clothingImage={clothingImage}
            modelImage={modelImage}
            onSetClothing={handleSetClothing}
            onSetModel={handleSetModel}
            isProcessing={isProcessing}
          />
        )}

        {resultImage ? (
          <section className="max-w-4xl mx-auto w-full mt-4 flex flex-col items-center border border-outline-variant/15 p-1 rounded-xl shadow-2xl">
            <div className="bg-surface-container-lowest rounded-lg overflow-hidden relative w-full aspect-[3/4] md:aspect-video flex items-center justify-center">
              <img
                alt="Resultado gerado pela IA"
                className="w-full h-full object-cover"
                src={resultImage}
              />

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-panel px-8 py-4 rounded-full flex gap-6 items-center border border-outline-variant/15 shadow-xl">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = `digital-atelier-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex items-center gap-2 text-on-surface hover:text-secondary transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                    download
                  </span>
                  <span className="font-label text-[10px] uppercase tracking-[0.05em] font-medium">
                    Salvar
                  </span>
                </button>
                <div className="w-px h-4 bg-outline-variant/30"></div>
                <button
                  onClick={clearStates}
                  className="flex items-center gap-2 text-on-surface hover:text-secondary transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                    refresh
                  </span>
                  <span className="font-label text-[10px] uppercase tracking-[0.05em] font-medium">
                    Tentar Outra
                  </span>
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="flex flex-col items-center mb-32 h-20 justify-center">
            <button
              onClick={sendTryOnRequest}
              disabled={!clothingImage || !modelImage || isProcessing}
              className="cta-gradient text-on-secondary px-12 py-5 rounded uppercase font-label text-sm tracking-[0.05em] font-bold shadow-[0_20px_40px_-10px_rgba(0,64,224,0.3)] hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              Provar Roupa Agora
            </button>
          </div>
        )}
      </main>
      <TryOnLoadingModal isVisible={isProcessing} />
      <Footer />
    </>
  );
};
