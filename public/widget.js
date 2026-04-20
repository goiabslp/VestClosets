(function () {
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

  // 🌟 O NOVO DETETIVE: Procura a imagem ANTES de criar o Iframe
  const ogImage = document.querySelector('meta[property="og:image"]');
  const imgUrl = (ogImage && ogImage.content) ? ogImage.content : '';

  if (imgUrl) {
    console.log("🕵️‍♂️ Detetive achou a imagem da roupa:", imgUrl);
  } else {
    console.log("Tag og:image não encontrada nesta página.");
  }

  // 3. O Iframe apontando para o seu site, levando a URL da imagem como bagagem
  const iframe = document.createElement('iframe');
  iframe.src = `https://vest-closets.vercel.app/widget?roupa=${encodeURIComponent(imgUrl)}`;
  iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
  modalContainer.appendChild(iframe);

  // 4. Lógica de Abrir/Fechar o Modal
  button.onclick = () => {
    modalContainer.style.display = modalContainer.style.display === 'none' ? 'block' : 'none';
  };

  document.body.appendChild(button);
  document.body.appendChild(modalContainer);
})();