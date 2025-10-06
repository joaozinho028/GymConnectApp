const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Configurar variáveis de ambiente primeiro
dotenv.config();

// Importar configuração do Supabase
const { verificarConexao } = require("./config/supabase");

// Importar rotas
const authRoutes = require("./routes/auth");
const gymRoutes = require("./routes/gyms");
const userRoutes = require("./routes/users");
const appointmentRoutes = require("./routes/appointments");
const proprietarioRoutes = require("./routes/proprietarios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:19006", 
      "http://192.168.1.69:19006",
      "exp://192.168.1.69:19000",
      "exp://192.168.1.100:19000"
    ], // Expo development server
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Log de requisições em desenvolvimento
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Rotas da API
app.use("/api/auth", authRoutes); // Autenticação para usuários do app móvel
app.use("/api/gyms", gymRoutes); // Academias públicas para app móvel
app.use("/api/users", userRoutes); // Perfil de usuários do app móvel
app.use("/api/appointments", appointmentRoutes); // Agendamentos do app móvel
app.use("/api/proprietarios", proprietarioRoutes); // Dashboard SaaS para proprietários

// Rota de teste
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "GymConnect API está funcionando!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro na API:", err);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Erro interno do servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Middleware para rotas não encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Rota ${req.originalUrl} não encontrada`,
  });
});

// Iniciar servidor
const iniciarServidor = async () => {
  try {
    // Verificar conexão com Supabase
    const conexaoOk = await verificarConexao();
    if (!conexaoOk) {
      console.error(
        "❌ Falha na conexão com Supabase. Verifique as configurações."
      );
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor GymConnect rodando na porta ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(
        `📱 App Móvel: /api/auth, /api/gyms, /api/users, /api/appointments`
      );
      console.log(`💼 Dashboard SaaS: /api/proprietarios`);
      console.log(`🗃️ Database: Multi-tenant com arquitetura SaaS`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

iniciarServidor();
