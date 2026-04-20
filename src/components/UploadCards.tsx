import React, { useRef } from 'react';
import type { FileData } from '../hooks/useVirtualTryOn';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadCardsProps {
  clothingImage: FileData | null;
  modelImage: FileData | null;
  onSetClothing: (file: File) => void;
  onSetModel: (file: File) => void;
  isProcessing: boolean;
}

export const UploadCards: React.FC<UploadCardsProps> = ({
  clothingImage,
  modelImage,
  onSetClothing,
  onSetModel,
  isProcessing
}) => {
  const clothingInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'clothing' | 'model') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'clothing') onSetClothing(file);
      else onSetModel(file);
    }
    e.target.value = '';
  };

  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          onClick={() => !isProcessing && clothingInputRef.current?.click()}
          className={cn(
            "relative bg-surface-container-lowest rounded-lg p-12 flex flex-col items-center justify-center border border-outline-variant/15 transition-colors duration-300 min-h-[300px] overflow-hidden group",
            isProcessing ? "opacity-50 cursor-not-allowed" : "hover:bg-surface-container-low cursor-pointer hover:border-secondary/30 shadow-sm hover:shadow-md"
          )}
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
             <>
               <img src={clothingImage.previewUrl} alt="Roupa da Escolha" className="absolute inset-0 w-full h-full object-cover rounded-lg z-0" />
               <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/30 transition-all rounded-lg z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="font-label uppercase font-bold text-white tracking-[0.05em] text-sm">Trocar Imagem</span>
               </div>
             </>
          ) : (
            <>
              <span className="material-symbols-outlined text-outline mb-6 group-hover:text-secondary transition-colors" style={{ fontSize: '3rem'}}>checkroom</span>
              <h3 className="font-label text-sm uppercase tracking-[0.05em] font-bold text-on-surface mb-2">Adicionar Roupa</h3>
              <p className="font-body text-sm text-outline text-center">Clique para selecionar do computador</p>
            </>
          )}
        </div>

        <div 
          onClick={() => !isProcessing && modelInputRef.current?.click()}
          className={cn(
            "relative bg-surface-container-lowest rounded-lg p-12 flex flex-col items-center justify-center border border-outline-variant/15 transition-colors duration-300 min-h-[300px] overflow-hidden group",
            isProcessing ? "opacity-50 cursor-not-allowed" : "hover:bg-surface-container-low cursor-pointer hover:border-secondary/30 shadow-sm hover:shadow-md"
          )}
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
             <>
               <img src={modelImage.previewUrl} alt="Modelo da Escolha" className="absolute inset-0 w-full h-full object-cover rounded-lg z-0" />
               <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/30 transition-all rounded-lg z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="font-label uppercase font-bold text-white tracking-[0.05em] text-sm">Trocar Imagem</span>
               </div>
             </>
          ) : (
            <>
              <span className="material-symbols-outlined text-outline mb-6 group-hover:text-secondary transition-colors" style={{ fontSize: '3rem'}}>portrait</span>
              <h3 className="font-label text-sm uppercase tracking-[0.05em] font-bold text-on-surface mb-2">Adicionar Modelo</h3>
              <p className="font-body text-sm text-outline text-center">Clique para selecionar do computador</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
