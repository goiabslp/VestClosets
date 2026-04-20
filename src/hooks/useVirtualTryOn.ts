import { useState, useCallback } from 'react';
import { ModalService } from '../store/useModalStore';
import { fileToBase64 } from '../utils/fileUtils';

export interface FileData {
  file: File;
  previewUrl: string;
}

export const useVirtualTryOn = () => {
  const [clothingImage, setClothingImage] = useState<FileData | null>(null);
  const [modelImage, setModelImage] = useState<FileData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      ModalService.error('Apenas arquivos JPG, JPEG ou PNG são permitidos.', 'Formato Inválido');
      return false;
    }

    if (file.size > MAX_SIZE) {
      ModalService.error(
        `O tamanho da imagem excede o limite de qualidade original permitido de 5MB.`,
        'Arquivo Muito Grande'
      );
      return false;
    }

    return true;
  };

  const handleSetClothing = (file: File) => {
    if (validateFile(file)) {
      const previewUrl = URL.createObjectURL(file);
      setClothingImage({ file, previewUrl });
    }
  };

  const handleSetModel = (file: File) => {
    if (validateFile(file)) {
      const previewUrl = URL.createObjectURL(file);
      setModelImage({ file, previewUrl });
    }
  };

  const clearStates = () => {
    if (clothingImage) URL.revokeObjectURL(clothingImage.previewUrl);
    if (modelImage) URL.revokeObjectURL(modelImage.previewUrl);
    setClothingImage(null);
    setModelImage(null);
    setResultImage(null);
    setIsProcessing(false);
  };

  const sendTryOnRequest = useCallback(async (category: 'upper_body' | 'lower_body' | 'dresses') => {
    if (!clothingImage || !modelImage) {
      ModalService.error(
        'Adicione ambas as imagens respeitando os limites para processar.',
        'Faltam Imagens'
      );
      return;
    }

    setIsProcessing(true);
    setResultImage(null);

    try {
      // 1. A MÁGICA ANTES DO DISPARO: Converte os dois arquivos
      const base64Clothing = await fileToBase64(clothingImage.file);
      const base64Model = await fileToBase64(modelImage.file);

      // Usado para garantir um Timeout Controlado de 60 Segundos em requisições demoradas da IA.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      // 2. Agora sim, envia para a sua API na Vercel enviando um JSON
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clothingImage: base64Clothing,
          modelImage: base64Model,
          category,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      // 🕵️‍♂️ ADICIONE ESTA LINHA AQUI:
      console.log('O QUE A IA DEVOLVEU:', data);

      if (!response.ok) {
        throw new Error(data.error || `Erro de comunicação: status ${response.status}`);
      }

      if (data.success && data.resultImage) {
        setResultImage(data.resultImage);
      } else {
        throw new Error(data.message || 'Houve falha com a predição da IA.');
      }
    } catch (error: unknown) {
      // <-- AQUI: Substituído 'any' por 'unknown'
      console.error(error);

      // Checagem de tipo segura para agradar o TypeScript
      const isAbortError = error instanceof Error && error.name === 'AbortError';
      const errorMessage =
        error instanceof Error ? error.message : 'Ocorreu um problema ao enviar seu pedido.';

      if (isAbortError) {
        ModalService.error(
          'A resposta demorou muito para chegar. A rede interceptou e cancelou a rota.',
          'Timeout na IA'
        );
      } else {
        ModalService.error(errorMessage, 'Falha na Geração');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [clothingImage, modelImage]);

  return {
    clothingImage,
    modelImage,
    isProcessing,
    resultImage,
    handleSetClothing,
    handleSetModel,
    sendTryOnRequest,
    clearStates,
  };
};
