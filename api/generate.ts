import Replicate from "replicate";
// 1. Importe os tipos da Vercel
import type { VercelRequest, VercelResponse } from '@vercel/node';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// 2. Adicione os tipos (: VercelRequest e : VercelResponse) aqui:
export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    // 1. Recebendo as imagens do seu front-end
    const { modelImage, clothingImage } = req.body;

    if (!modelImage || !clothingImage) {
      return res.status(400).json({ error: 'Faltam imagens na requisição.' });
    }

    console.log("Enviando imagens para a IA no Replicate...");

    // 2. A Chamada Real para a IA (Novo Modelo IDM-VTON Oficial)
    const output = await replicate.run(
      "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      {
        input: {
          human_img: modelImage,      // A foto original do cliente/modelo
          garm_img: clothingImage,    // A foto da roupa
          category: "upper_body",     // Pode ser 'upper_body', 'lower_body' ou 'dresses'

          // 🌟 PARÂMETROS DE ALTA QUALIDADE E PROPORÇÃO 🌟
          crop: false, // O MAIS IMPORTANTE: Impede cortes e mantém 100% da proporção original da foto
          steps: 35,   // Elevado para 35: Aumenta o processamento para garantir texturas perfeitas e fotorealistas
          garment_des: "A high quality, highly detailed clothing item, 4k resolution, cinematic lighting, ultra sharp realism", // Força a IA a aplicar um estilo visual premium
        }
      }
    );

    // 3. O Replicate retorna a URL da imagem processada com sucesso!
    console.log("Magia concluída!");

    // Extraindo a URL real de dentro do objeto complexo do Replicate
    const outputData = Array.isArray(output) ? output[0] : output;

    let imageUrl = "";
    // Verifica se é o novo formato FileOutput do Replicate que exige usar .url()
    if (outputData && typeof outputData === 'object') {
      imageUrl = typeof outputData.url === 'function' ? outputData.url().href : outputData.url;
    } else {
      imageUrl = String(outputData); // Se for a versão antiga, já é o texto da URL
    }

    return res.status(200).json({
      success: true,
      resultImage: imageUrl
    });

  } catch (error) {
    // Isso vai imprimir o erro gigante e vermelho no seu terminal do VS Code
    console.error("ERRO COMPLETO DA IA:", error);

    // Isso vai mandar o erro real para o navegador do usuário
    return res.status(500).json({
      error: `Erro Real: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    });
  }
}