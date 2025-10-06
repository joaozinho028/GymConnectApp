const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Configuração do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "As variáveis SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias"
  );
}

// Cliente público (para operações normais do app móvel)
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  },
});

// Cliente admin (para operações do dashboard SaaS)
const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Função para verificar conexão
const verificarConexao = async () => {
  try {
    const { data, error } = await supabase
      .from("proprietarios")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Erro ao verificar conexão:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return false;
    }

    console.log("✅ Conexão com Supabase estabelecida com sucesso");
    console.log(`📊 Tabela 'proprietarios' acessível (${data?.length || 0} registros encontrados)`);
    return true;
  } catch (error) {
    console.error("❌ Falha na conexão com Supabase:", {
      message: error.message,
      details: error.stack,
      hint: error.hint || '',
      code: error.code || ''
    });
    return false;
  }
};

// Middleware para autenticação JWT
const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ erro: "Token não fornecido" });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ erro: "Token inválido" });
    }

    req.usuario = user;
    next();
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
};

// Middleware para verificar se é proprietário (dashboard)
const verificarProprietario = async (req, res, next) => {
  try {
    const userId = req.usuario.id;

    const { data: proprietario, error } = await supabase
      .from("proprietarios")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !proprietario) {
      return res
        .status(403)
        .json({ erro: "Acesso negado: usuário não é proprietário" });
    }

    req.proprietario = proprietario;
    next();
  } catch (error) {
    console.error("Erro na verificação de proprietário:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
};

// Função para obter academias por proprietário (dashboard)
const obterAcademiasPorProprietario = async (proprietarioId) => {
  const { data, error } = await supabase
    .from("academias")
    .select(
      `
      *,
      planos_academia (*),
      galeria_academia (*)
    `
    )
    .eq("proprietario_id", proprietarioId)
    .order("nome");

  if (error) {
    throw error;
  }

  return data;
};

// Função para obter academias públicas (app móvel)
const obterAcademiasPublicas = async (filtros = {}) => {
  let query = supabase
    .from("academias")
    .select(
      `
      *,
      planos_academia (*),
      galeria_academia (*)
    `
    )
    .eq("status", "ativa")
    .eq("visibilidade", true);

  // Aplicar filtros opcionais
  if (filtros.latitude && filtros.longitude && filtros.raio) {
    // Filtro por proximidade (simplificado)
    const { latitude, longitude, raio } = filtros;
    query = query
      .gte("latitude", latitude - raio)
      .lte("latitude", latitude + raio)
      .gte("longitude", longitude - raio)
      .lte("longitude", longitude + raio);
  }

  if (filtros.precoMin) {
    query = query.gte("preco_base", filtros.precoMin);
  }

  if (filtros.precoMax) {
    query = query.lte("preco_base", filtros.precoMax);
  }

  if (filtros.avaliacaoMin) {
    query = query.gte("avaliacao", filtros.avaliacaoMin);
  }

  const { data, error } = await query.order("avaliacao", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

module.exports = {
  supabase,
  supabaseAdmin,
  verificarConexao,
  verificarToken,
  verificarProprietario,
  obterAcademiasPorProprietario,
  obterAcademiasPublicas,
};
