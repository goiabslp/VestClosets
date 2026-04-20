import React, { useRef } from 'react';
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

  const clothingInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'clothing' | 'model') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'clothing') handleSetClothing(file);
      else handleSetModel(file);
    }
    e.target.value = '';
  };

  return (
    <div className="w-full flex-grow flex flex-col items-center bg-white font-sans rounded-xl overflow-hidden p-6 md:p-10 max-w-lg mx-auto">
      {!resultImage ? (
        <>
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Visualização Inteligente
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-1 tracking-tight">Experimente agora</h2>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8 w-full">
            {/* Left Circle - Produto */}
            <div className="flex flex-col items-center gap-4">
              <div
                onClick={() => !isProcessing && clothingInputRef.current?.click()}
                className={`w-28 h-28 rounded-full flex items-center justify-center overflow-hidden relative shadow-md transition-all ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-lg bg-gray-100"
                  }`}
              >
                <input
                  type="file"
                  ref={clothingInputRef}
                  className="hidden"
                  accept="image/jpeg, image/jpg, image/png"
                  onChange={(e) => handleFileChange(e, 'clothing')}
                  disabled={isProcessing}
                />
                {clothingImage ? (
                  <img src={clothingImage.previewUrl} alt="Produto" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Produto</span>
            </div>

            {/* Separator Line */}
            <div className="w-8 h-[1px] bg-gray-200"></div>

            {/* Right Circle - Modelo */}
            <div className="flex flex-col items-center gap-4">
              <div
                onClick={() => !isProcessing && modelInputRef.current?.click()}
                className={`w-28 h-28 rounded-full flex items-center justify-center overflow-hidden transition-all ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-300 bg-[#E5E5E5]"
                  }`}
              >
                <input
                  type="file"
                  ref={modelInputRef}
                  className="hidden"
                  accept="image/jpeg, image/jpg, image/png"
                  onChange={(e) => handleFileChange(e, 'model')}
                  disabled={isProcessing}
                />
                {modelImage ? (
                  <img src={modelImage.previewUrl} alt="Modelo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-gray-400 font-light">+</span>
                )}
              </div>
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Adicionar Modelo</span>
            </div>
          </div>

          <div className="w-full max-w-sm mt-4">
            <button
              onClick={sendTryOnRequest}
              disabled={!clothingImage || !modelImage || isProcessing}
              className="w-full bg-[#525252] hover:bg-[#3D3D3D] text-white py-4 rounded text-xs uppercase tracking-widest font-bold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Provar Roupa
            </button>
            <p className="text-[11px] text-gray-400 text-center mt-5 leading-relaxed px-4">
              Nossa IA processará sua foto para criar uma<br />representação realista do caimento.
            </p>
          </div>
        </>
      ) : (
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Resultado
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-1 tracking-tight">Seu novo look</h2>
          </div>

          <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-inner mb-6 relative">
            <img
              alt="Resultado gerado pela IA"
              className="w-full h-full object-contain"
              src={resultImage}
            />
          </div>

          <div className="flex flex-col w-full gap-3">
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
              className="flex items-center justify-center gap-2 bg-[#525252] hover:bg-[#3D3D3D] text-white transition-colors py-3.5 rounded shadow text-xs uppercase tracking-widest font-bold"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>download</span>
              Salvar Imagem
            </button>

            <button
              onClick={clearStates}
              className="flex items-center justify-center gap-2 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors py-3.5 rounded shadow-sm border border-gray-200 text-xs uppercase tracking-widest font-bold"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>refresh</span>
              Tentar Outra
            </button>
          </div>
        </div>
      )}

      <TryOnLoadingModal isVisible={isProcessing} />
    </div>
  );
};