require('dotenv').config();
const http = require('http');
const { handleNewPost, handleGetPosts } = require('./routes/posts');

const server = http.createServer((req, res) => {
  // Configurações CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS (pré-flight)
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Rotas
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'API funcionando',
      message: 'Bem-vindo ao meu-projeto-posts',
      endpoints: {
        create_post: 'POST /posts',
        get_posts: 'GET /posts'
      }
    }));
  }
  else if (req.method === 'POST' && req.url === '/posts') {
    handleNewPost(req, res);
  } 
  else if (req.method === 'GET' && req.url === '/posts') {
    handleGetPosts(req, res);
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Rota não encontrada',
      available_routes: {
        root: 'GET /',
        create_post: 'POST /posts',
        get_posts: 'GET /posts'
      }
    }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}`);
});