const API_URL = 'https://seu-backend-no-railway.up.railway.app'; // Altere para sua URL real

async function carregarPosts() {
  const res = await fetch(`${API_URL}/posts`);
  const posts = await res.json();
  const feed = document.getElementById('feed');
  feed.innerHTML = '';

  posts.reverse().forEach(post => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `
      <strong>${post.autor}</strong><br>
      <p>${post.mensagem}</p>
      ${post.imagemUrl ? `<img src="${post.imagemUrl}" width="100%">` : ''}
      ${post.videoUrl ? `<video src="${post.videoUrl}" controls width="100%"></video>` : ''}
      <small>${new Date(post.createdAt).toLocaleString()}</small>
    `;
    feed.appendChild(div);
  });
}

async function enviarPost() {
  const autor = document.getElementById('autor').value;
  const mensagem = document.getElementById('mensagem').value;
  const imagem = document.getElementById('imagem').files[0];
  const video = document.getElementById('video').files[0];

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const imagemBase64 = imagem ? await toBase64(imagem) : '';
  const videoBase64 = video ? await toBase64(video) : '';

  const body = {
    autor,
    mensagem,
    imagemBase64,
    videoBase64
  };

  await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  document.getElementById('mensagem').value = '';
  document.getElementById('imagem').value = '';
  document.getElementById('video').value = '';
  carregarPosts();
}

carregarPosts();
