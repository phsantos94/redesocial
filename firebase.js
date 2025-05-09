require('dotenv').config();
const admin = require("firebase-admin");

// 1. Função para decodificar e validar as credenciais
function decodeFirebaseCredentials() {
  try {
    // Verifica se a variável existe
    if (!process.env.FIREBASE_BASE64) {
      throw new Error('Variável FIREBASE_CONFIG_BASE64 não encontrada no .env');
    }

    // Remove TODOS os espaços e quebras de linha
    const cleanBase64 = process.env.FIREBASE_CONFIG_BASE64.replace(/\s/g, '');

    // Decodificação em duas etapas com tratamento de erros
    const decoded = Buffer.from(cleanBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(decoded);

    // Verificação EXTRA da chave privada
    if (!serviceAccount.private_key) {
      throw new Error('Chave privada não encontrada nas credenciais');
    }

    // Corrige as quebras de linha escapadas na chave privada
    const fixedCredentials = {
      ...serviceAccount,
      private_key: serviceAccount.private_key.replace(/\\n/g, '\n')
    };

    return fixedCredentials;
  } catch (error) {
    console.error('❌ Erro ao decodificar credenciais:', error.message);
    if (error instanceof SyntaxError) {
      console.log('📌 Dica: Verifique se o FIREBASE_CONFIG_BASE64 contém um JSON válido em base64');
    }
    process.exit(1);
  }
}

// 2. Inicialização do Firebase
try {
  const serviceAccount = decodeFirebaseCredentials();

  const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "meu-projeto-b0357.appspot.com",
    databaseURL: "https://meu-projeto-b0357.firebaseio.com"
  };

  const app = admin.initializeApp(firebaseConfig);
  
  console.log('✅ Firebase inicializado com sucesso!');
  console.log('🔗 Projeto:', serviceAccount.project_id);
  
  module.exports = {
    bucket: admin.storage().bucket(),
    db: admin.firestore(),
    auth: admin.auth(),
    admin
  };

} catch (error) {
  console.error('🔥 Falha crítica na inicialização:', error.message);
  console.log('\n📌 Possíveis causas:');
  console.log('1. Arquivo credenciais-firebase.json corrompido');
  console.log('2. Base64 mal formado no .env');
  console.log('3. Problema de escape de caracteres');
  process.exit(1);
}