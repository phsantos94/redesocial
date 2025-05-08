require('dotenv').config(); // ← Carregado primeiro!
console.log("COUCHDB_URL:", process.env.COUCHDB_URL);

const http = require('http');
const { handleNewPost, handleGetPosts } = require('./routes/posts');

const server = http.createServer((req, res) => {
  // 👉 Cabeçalhos CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 👉 Tratamento para requisições OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // 👉 Roteamento
  if (req.method === 'POST' && req.url === '/posts') {
    handleNewPost(req, res);
  } else if (req.method === 'GET' && req.url === '/posts') {
    handleGetPosts(req, res);
  } else {
    res.writeHead(404);
    res.end('Rota não encontrada');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
