import React from 'react';
import { UploadCards } from './UploadCards';
import { TryOnLoadingModal } from './TryOnLoadingModal';
import { useVirtualTryOn } from '../hooks/useVirtualTryOn';

export const WidgetView: React.FC = () => {
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

  // 🌟 O NOVO RECEPTOR: Olha para a URL assim que a tela nasce (Query Params)
  React.useEffect(() => {
    const carregarImagemDaUrl = async () => {
      // 1. Lê os parâmetros da URL (ex: ?roupa=https://...)
      const params = new URLSearchParams(window.location.search);
      const urlDaRoupa = params.get('roupa');

      // 2. Se achou a imagem na "bagagem", faz o download
      if (urlDaRoupa) {
        try {
          console.log("Receptor React: Processando imagem da URL...", urlDaRoupa);
          const response = await fetch(urlDaRoupa);

          if (!response.ok) throw new Error('Falha ao baixar imagem');

          const blob = await response.blob();
          const file = new File([blob], "roupa-da-loja.jpg", { type: blob.type || "image/jpeg" });

          // 3. Joga no seu estado pronto para uso!
          handleSetClothing(file);
        } catch (error) {
          console.error("Erro ao processar imagem automática da loja:", error);
        }
      }
    };

    carregarImagemDaUrl();
  }, [handleSetClothing]);

  return (
    <div className="w-full flex-grow flex flex-col relative bg-transparent font-sans">
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
        <section className="max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-6 border border-outline-variant/15 p-4 rounded-xl shadow-2xl bg-surface">
          <div className="bg-surface-container-lowest rounded-lg overflow-hidden relative flex-1 aspect-[3/4] md:aspect-video flex items-center justify-center border border-outline-variant/20">
            <img
              alt="Resultado gerado pela IA"
              className="w-full h-full object-contain"
              src={resultImage}
            />
          </div>

          <div className="flex flex-col justify-center gap-4 md:w-64">
            <button
              onClick={async () => {
                try {
                  const response = await fetch(resultImage);
                  const blob = await response.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = blobUrl;
                  link.download = `digital-atelier-${Date.now()}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(blobUrl);
                } catch (error) {
                  console.error('Download error:', error);
                  const link = document.createElement('a');
                  link.href = resultImage;
                  link.download = `digital-atelier-${Date.now()}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              className="flex items-center justify-center gap-3 bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container transition-colors px-6 py-4 rounded-xl shadow-md font-label text-xs uppercase tracking-[0.05em] font-bold active:scale-[0.98]"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                download
              </span>
              Salvar Imagem
            </button>

            <button
              onClick={clearStates}
              className="flex items-center justify-center gap-3 bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors px-6 py-4 rounded-xl shadow-sm border border-outline-variant/20 font-label text-xs uppercase tracking-[0.05em] font-bold active:scale-[0.98]"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                refresh
              </span>
              Tentar Outra
            </button>
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
      <TryOnLoadingModal isVisible={isProcessing} />
    </div>
  );
};