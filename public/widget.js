(function() {
  // 1. Cria o Botão Flutuante
  const button = document.createElement('button');
  button.innerText = '👕 Provar Roupa';
  button.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    padding: 12px 24px; background: #000; color: white;
    border: none; border-radius: 50px; cursor: pointer;
    z-index: 999999; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  `;

  // 2. Cria o Container do Iframe (Oculto)
  const modalContainer = document.createElement('div');
  modalContainer.style.cssText = `
    position: fixed; bottom: 80px; right: 20px;
    width: 400px; height: 600px; border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 999999;
    display: none; overflow: hidden; background: white;
  `;

  // 3. O Iframe apontando para o seu site (Use localhost para testar agora)
  const iframe = document.createElement('iframe');
  iframe.src = 'http://localhost:3000/widget'; 
  iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
  modalContainer.appendChild(iframe);

  // 🌟 A MÁGICA ACONTECE AQUI: Quando o Iframe terminar de carregar
  iframe.onload = () => {
    // Procura a tag og:image escondida no HTML da loja
    const ogImage = document.querySelector('meta[property="og:image"]');
    
    if (ogImage && ogImage.content) {
      console.log("🕵️‍♂️ Detetive achou a imagem da roupa:", ogImage.content);
      
      // Envia a URL da imagem para dentro do seu React
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: 'SET_CLOTHING', url: ogImage.content }, 
          '*'
        );
      }
    } else {
      console.log("Tag og:image não encontrada nesta página.");
    }
  };

  // 4. Lógica de Abrir/Fechar o Modal
  button.onclick = () => {
    modalContainer.style.display = modalContainer.style.display === 'none' ? 'block' : 'none';
  };

  document.body.appendChild(button);
  document.body.appendChild(modalContainer);
})();
