const admin = require("firebase-admin");

const base64 = process.env.FIREBASE_CONFIG_BASE64;
const json = Buffer.from(base64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(json);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "meu-projeto-b0357.appspot.com" // troque pelo seu bucket real
});

const bucket = admin.storage().bucket();
module.exports = { bucket };
