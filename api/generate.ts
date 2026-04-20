import Replicate from "replicate";
// 1. Importe os tipos da Vercel
import type { VercelRequest, VercelResponse } from '@vercel/node';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    // 1. Recebendo as imagens do seu front-end (espera-se que venham em Base64 ou URL pública)
    // Deixei o 'category' dinâmico caso você queira enviar 'lower_body' no futuro
    const { modelImage, clothingImage, category = "upper_body" } = req.body;

    if (!modelImage || !clothingImage) {
      return res.status(400).json({ error: 'Faltam imagens na requisição.' });
    }

    console.log("Enviando imagens para a IA no Replicate...");

    // 2. A Chamada Real para a IA (Novo Modelo IDM-VTON Oficial)
    const output = await replicate.run(
      "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      {
        input: {
          human_img: modelImage,
          garm_img: clothingImage,
          category: category,

          // 🌟 1. TRAVA DE PROPORÇÃO (Protege a imagem original)
          crop: false,
          is_checked_crop: false, // Dupla garantia para não cortar rostos ou cenários

          // 🌟 2. PODER DE PROCESSAMENTO (Qualidade do tecido)
          steps: 40,

          // 🌟 3. ORDEM DE FIDELIDADE ABSOLUTA E ESTÉTICA PREMIUM
          garment_des: "The EXACT garment shown in the reference image. Preserve all original patterns, textures, logos, colors, cuts, collars, and structural details with 100% absolute fidelity. Fit naturally and realistically onto the model's body following the fabric's physical behavior. 4k resolution, total sharpness, cinematic studio lighting, highly detailed.",

          // 🌟 4. A GRADE DE PROTEÇÃO (O que a IA NÂO PODE fazer)
          negative_prompt: "modified design, wrong color, distorted pattern, missing details, altered logos, different fabric, unnatural fit, mutated clothes, blending with skin, blurry textures, bad anatomy, cropped head, cropped feet, bad lighting",
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