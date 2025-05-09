// db.js
require('dotenv').config();
const nano = require('nano')(process.env.COUCHDB_URL);

// Use diretamente o banco "posts"
const db = nano.db.use('posts');

module.exports = db;
