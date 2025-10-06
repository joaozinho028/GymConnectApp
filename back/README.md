# GymConnect Backend API

Backend Node.js/Express para o aplicativo GymConnect - Sistema SaaS multi-tenant para academias.

## 🏗️ Arquitetura

O sistema possui **duas interfaces principais**:

1. **📱 App Móvel** - Para usuários finais que buscam e agendam academias
2. **💼 Dashboard SaaS** - Para proprietários de academias gerenciarem seus negócios

### Multi-Tenancy

- Cada proprietário possui suas próprias academias isoladas
- Usuários do app móvel veem apenas academias ativas e públicas
- Controle de acesso baseado em RLS (Row Level Security) do Supabase

## 🚀 Tecnologias

- **Node.js** + **Express.js** - API REST
- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth + Storage)
- **JWT** - Autenticação (via Supabase Auth)
- **bcryptjs** - Hash de senhas (backup)
- **cors** - Controle de CORS

## 📁 Estrutura do Projeto

```
back/
├── config/
│   └── supabase.js          # Configuração do Supabase
├── database/
│   └── schema.sql           # Schema completo do banco (português)
├── routes/
│   ├── auth.js             # Autenticação do app móvel
│   ├── gyms.js             # Academias públicas (app móvel)
│   ├── users.js            # Perfil usuários (app móvel)
│   ├── appointments.js     # Agendamentos (app móvel)
│   └── proprietarios.js    # Dashboard SaaS (proprietários)
├── .env.example            # Variáveis de ambiente
├── package.json            # Dependências
└── server.js              # Servidor principal
```

## 🗄️ Banco de Dados

### Tabelas Principais (em Português)

- **proprietarios** - Donos de academias (SaaS)
- **usuarios** - Usuários do app móvel
- **academias** - Estabelecimentos com multi-tenancy
- **planos_academia** - Planos de cada academia
- **agendamentos** - Reservas dos usuários
- **favoritos_usuario** - Academias favoritas
- **galeria_academia** - Fotos das academias
- **sessoes_api** - Integração entre sistemas
- **auditoria** - Log de mudanças

### Características

- **RLS (Row Level Security)** habilitado
- **Triggers** para auditoria automática
- **Índices** otimizados para performance
- **Políticas** de segurança para isolamento de dados

## 🚀 Configuração

### 1. Instalar dependências

```bash
cd back
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:

```env
SUPABASE_URL=https://sua-url-do-supabase.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
JWT_SECRET=seu-jwt-secret-muito-seguro-aqui
PORT=3000
NODE_ENV=development
```

### 3. Configurar banco de dados no Supabase

1. Acesse o [Supabase](https://supabase.com) e crie um novo projeto
2. No SQL Editor, execute o arquivo `database/schema.sql`
3. Execute o arquivo `database/seed.sql` para popular com dados de exemplo

### 4. Iniciar o servidor

**Desenvolvimento:**

```bash
npm run dev
```

**Produção:**

```bash
npm start
```

## 📚 API Endpoints

### Autenticação

- `POST /api/auth/register` - Cadastrar usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Dados do usuário atual

### Academias

- `GET /api/gyms` - Listar academias
- `GET /api/gyms/:id` - Buscar academia por ID
- `GET /api/gyms/nearby/:lat/:lng` - Buscar academias próximas

### Usuários

- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `POST /api/users/favorites/:gymId` - Adicionar favorito
- `DELETE /api/users/favorites/:gymId` - Remover favorito
- `GET /api/users/favorites` - Listar favoritos

### Agendamentos

- `GET /api/appointments` - Listar agendamentos
- `POST /api/appointments` - Criar agendamento
- `PUT /api/appointments/:id` - Atualizar agendamento
- `DELETE /api/appointments/:id` - Deletar agendamento
- `GET /api/appointments/:id` - Buscar agendamento específico

### Health Check

- `GET /api/health` - Status da API

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```javascript
Authorization: Bearer seu_jwt_token_aqui
```

## 📝 Estrutura do Projeto

```
back/
├── config/
│   └── supabase.js          # Configuração do Supabase
├── routes/
│   ├── auth.js              # Rotas de autenticação
│   ├── gyms.js              # Rotas de academias
│   ├── users.js             # Rotas de usuários
│   └── appointments.js      # Rotas de agendamentos
├── database/
│   ├── schema.sql           # Schema do banco de dados
│   └── seed.sql             # Dados de exemplo
├── server.js                # Servidor principal
├── package.json             # Dependências
└── .env.example             # Exemplo de variáveis de ambiente
```

## 🔧 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Supabase** - Backend as a Service (BaaS)
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **CORS** - Cross-Origin Resource Sharing
- **UUID** - Geração de IDs únicos

## 📊 Banco de Dados

O banco utiliza PostgreSQL através do Supabase com as seguintes tabelas:

- `users` - Usuários do sistema
- `gyms` - Academias cadastradas
- `gym_plans` - Planos das academias
- `gym_gallery` - Galeria de imagens das academias
- `user_favorites` - Favoritos dos usuários
- `appointments` - Agendamentos dos usuários

## 🧪 Testando a API

Use ferramentas como Postman, Insomnia ou curl para testar os endpoints:

```bash
# Health check
curl http://localhost:3000/api/health

# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"123456","name":"Teste"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"123456"}'
```

## 🚀 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente no seu provedor de hospedagem
2. Execute `npm install --production`
3. Execute `npm start`

## 📞 Suporte

Para dúvidas ou problemas, contate a equipe de desenvolvimento.
