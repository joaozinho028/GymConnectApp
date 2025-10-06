// Teste das APIs de registro e login
const API_URL = 'http://192.168.15.16:3000';

async function testarRegistro() {
  console.log('🔧 Testando API de registro...\n');

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: 'João Teste',
        email: 'joao.teste@email.com',
        password: '123456',
        telefone: '11999888777'
      }),
    });

    console.log('📊 Status da resposta:', response.status);
    
    const data = await response.json();
    console.log('📋 Resposta da API:', JSON.stringify(data, null, 2));

    if (response.ok && data.status === 'success') {
      console.log('\n✅ Registro realizado com sucesso!');
      return data.data.access_token;
    } else {
      console.log('\n❌ Falha no registro');
      console.log('💬 Mensagem:', data.message);
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

async function testarLogin() {
  console.log('\n🔧 Testando API de login...\n');

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'joao.teste@email.com',
        password: '123456',
      }),
    });

    console.log('📊 Status da resposta:', response.status);
    
    const data = await response.json();
    console.log('📋 Resposta da API:', JSON.stringify(data, null, 2));

    if (response.ok && data.status === 'success') {
      console.log('\n✅ Login realizado com sucesso!');
      console.log('👤 Usuário:', data.data.usuario.nome);
      console.log('🔑 Token recebido:', data.data.access_token ? 'Sim' : 'Não');
      return data.data.access_token;
    } else {
      console.log('\n❌ Falha no login');
      console.log('💬 Mensagem:', data.message);
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

async function executarTestes() {
  console.log('🚀 Iniciando testes da API...\n');
  
  // Primeiro tenta registrar
  await testarRegistro();
  
  // Depois tenta fazer login
  await testarLogin();
}

executarTestes();