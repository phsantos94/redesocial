const admin = require("firebase-admin");
const serviceAccount = require("./credenciais-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "meu-projeto-b0357.appspot.com" // este nome deve ser exatamente o mesmo do Firebase
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
