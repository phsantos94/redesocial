// db.js
require('dotenv').config();
const nano = require('nano')(process.env.COUCHDB_URL);

// Use diretamente o banco "posts" (precisa já existir no Cloudant)
const db = nano.db.use('posts');

module.exports = db;
