const { bucket } = require('../firebase');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Rota: POST /posts
async function handleNewPost(req, res) {
  let data = Buffer.alloc(0);
  req.on('data', chunk => {
    data = Buffer.concat([data, chunk]);
  });

  req.on('end', async () => {
    try {
      const body = JSON.parse(data.toString());
      const { autor, mensagem, imagemBase64, videoBase64 } = body;
      const id = uuidv4();
      let imagemUrl = '', videoUrl = '';

      if (imagemBase64) {
        const buffer = Buffer.from(imagemBase64, 'base64');
        const file = bucket.file(`posts/${id}.jpg`); 
        await file.save(buffer, { contentType: 'image/jpeg' });
        await file.makePublic();
        imagemUrl = file.publicUrl();
      }

      if (videoBase64) {
        const buffer = Buffer.from(videoBase64, 'base64');
        const file = bucket.file(`posts/${id}.mp4`);
        await file.save(buffer, { contentType: 'video/mp4' });
        await file.makePublic();
        videoUrl = file.publicUrl();
      }

      const doc = {
        _id: id,
        autor,
        mensagem,
        imagemUrl,
        videoUrl,
        likes: 0,
        comentarios: [],
        createdAt: new Date().toISOString()
      };

      await db.insert(doc);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ sucesso: true, id }));
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      res.end('Erro ao criar post');
    }
  });
}

// Rota: GET /posts
async function handleGetPosts(req, res) {
  try {
    const result = await db.list({ include_docs: true });
    const posts = result.rows.map(row => row.doc);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(posts));
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end('Erro ao buscar posts');
  }
}

module.exports = { handleNewPost, handleGetPosts };
