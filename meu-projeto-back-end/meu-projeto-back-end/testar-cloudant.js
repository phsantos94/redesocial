const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

// Instância do Cloudant com as credenciais corretas
const cloudant = CloudantV1.newInstance({
  authenticator: new IamAuthenticator({
    apikey: 'ZD42vnOz_gC0f_r3gw4JfE0kYTEi1_DIQ6wLC6adnbZ1',
  }),
  serviceUrl: 'https://230a4ea9-41b3-4ad6-90ac-f39d50b27a84-bluemix.cloudantnosqldb.appdomain.cloud',
});

// Função de teste de conexão
async function test() {
  try {
    const response = await cloudant.getAllDbs();
    console.log('✅ Bancos de dados disponíveis:', response.result);
  } catch (err) {
    console.error('❌ Erro ao conectar ao Cloudant:', err);
  }
}

test();
