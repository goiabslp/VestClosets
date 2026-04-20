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
    // 1. Recebendo as imagens e a categoria do seu front-end
    const { modelImage, clothingImage, category = "upper_body" } = req.body;

    if (!modelImage || !clothingImage) {
      return res.status(400).json({ error: 'Faltam imagens na requisição.' });
    }

    console.log(`Enviando imagens para a IA... Categoria detectada: ${category}`);

    // 🌟 2. O CÉREBRO DO PROMPT: Muda a ordem dependendo do tipo de roupa
    let promptEspecifico = "The EXACT garment shown in the reference image. Preserve all original patterns, textures, logos, colors, and cuts with 100% absolute fidelity. Fit naturally and realistically onto the model's body. 4k resolution, total sharpness, cinematic studio lighting, highly detailed.";

    let promptNegativo = "modified design, wrong color, distorted pattern, missing details, altered logos, different fabric, unnatural fit, mutated clothes, blending with skin, blurry textures, bad anatomy, cropped head, cropped feet, bad lighting";

    // Injeção cirúrgica de regras baseada na escolha do usuário
    if (category === "dresses") {
      promptEspecifico += " IMPORTANT: Fully preserve the SLEEVES, sleeve length, collar, and the full length of the skirt down to the legs. Do NOT remove sleeves.";
      promptNegativo += ", missing sleeves, sleeveless, cut off skirt, shortened length";
    } else if (category === "lower_body") {
      promptEspecifico += " IMPORTANT: Preserve the exact length and fit of the pants/skirt around the waist and legs.";
      promptNegativo += ", missing legs, shorts instead of pants";
    } else {
      promptEspecifico += " IMPORTANT: Fully preserve the SLEEVES, sleeve length, and collar of the top.";
      promptNegativo += ", missing sleeves, sleeveless";
    }

    // 3. A Chamada Real para a IA (Novo Modelo IDM-VTON Oficial)
    const output = await replicate.run(
      "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      {
        input: {
          human_img: modelImage,
          garm_img: clothingImage,
          category: category,

          // TRAVA DE PROPORÇÃO (Protege a imagem original)
          crop: false,
          is_checked_crop: false,

          // PODER DE PROCESSAMENTO (Qualidade do tecido)
          steps: 40,

          // Injetando as ordens que montamos ali em cima
          garment_des: promptEspecifico,
          negative_prompt: promptNegativo,
        }
      }
    );

    console.log("Magia concluída!");

    // Extraindo a URL real de dentro do objeto complexo do Replicate
    const outputData = Array.isArray(output) ? output[0] : output;

    let imageUrl = "";
    if (outputData && typeof outputData === 'object') {
      imageUrl = typeof outputData.url === 'function' ? outputData.url().href : outputData.url;
    } else {
      imageUrl = String(outputData);
    }

    return res.status(200).json({
      success: true,
      resultImage: imageUrl
    });

  } catch (error) {
    console.error("ERRO COMPLETO DA IA:", error);

    return res.status(500).json({
      error: `Erro Real: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    });
  }
}