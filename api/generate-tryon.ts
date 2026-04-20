export const config = {
  runtime: 'edge', // Usa Edge Runtime pra aceitar o parser nativo de requisições standard web e lidar perfeitamente com grandes requisições sem cold-start longo.
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { 
      status: 405, headers: { 'Content-Type': 'application/json' } 
    });
  }

  try {
    // Recupera diretamente do Payload FormData mantendo a originalidade realística e sem encoding Bloat.
    const formData = await req.formData();
    const clothingFile = formData.get('clothing') as File | null;
    const modelFile = formData.get('model') as File | null;

    if (!clothingFile || !modelFile) {
      return new Response(JSON.stringify({ error: 'Falta imagem da Roupa ou da Modelo.' }), { 
        status: 400, headers: { 'Content-Type': 'application/json' } 
      });
    }

    // AQUI OCORRERIA O DISPARO PARA RUNPOD / REPLICATE
    // Como a IA usualmente exige uma "URL" para imagem em seus payloads ou aceita base64,
    // o Backend (Serveless API) é o local perfeito para submeter essa imagem para um S3 Bucket 
    // ou hospedar silenciosamente no Vercel Blob e enviar o link pro modelo de difusão de IDM-VTON.
    // 
    // const replicateApiKey = process.env.REPLICATE_API_TOKEN;
    // ... logic ...

    // Mock de Tempo de Resposta e Polling Fake
    await new Promise((resolve) => setTimeout(resolve, 8000));
    
    // Retorno do link gerado real da IA (aqui usamos um Fallback mockado para validação do Front)
    return new Response(JSON.stringify({
      status: 'success',
      resultUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1280&auto=format&fit=crop'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Erro Interno do Servidor ou limite excedido' }), { 
      status: 500, headers: { 'Content-Type': 'application/json' } 
    });
  }
}
