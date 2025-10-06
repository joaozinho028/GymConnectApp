const express = require("express");
const {
  supabase,
  supabaseAdmin,
  verificarToken,
  verificarProprietario,
  obterAcademiasPorProprietario,
} = require("../config/supabase");

const router = express.Router();

// POST /api/proprietarios/register - Cadastro de proprietário (dashboard)
router.post("/register", async (req, res) => {
  try {
    const { email, password, nome, telefone, data_nascimento, empresa } =
      req.body;

    // Validação básica
    if (!email || !password || !nome) {
      return res.status(400).json({
        status: "error",
        message: "Email, senha e nome são obrigatórios",
      });
    }

    // Registrar proprietário via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: nome,
          telefone: telefone || null,
          data_nascimento: data_nascimento || null,
          empresa: empresa || null,
          tipo_usuario: "proprietario",
        },
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        return res.status(409).json({
          status: "error",
          message: "Email já está em uso",
        });
      }
      throw authError;
    }

    // Inserir dados complementares na tabela proprietarios
    const { data: proprietario, error } = await supabase
      .from("proprietarios")
      .insert([
        {
          id: authData.user.id,
          email,
          nome,
          telefone: telefone || null,
          data_nascimento: data_nascimento || null,
          empresa: empresa || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar registro de proprietário:", error);
    }

    res.status(201).json({
      status: "success",
      message: "Proprietário cadastrado com sucesso",
      data: {
        proprietario: proprietario || {
          id: authData.user.id,
          email: authData.user.email,
          nome,
        },
        session: authData.session,
        access_token: authData.session?.access_token,
      },
    });
  } catch (error) {
    console.error("Erro no registro de proprietário:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
      debug: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// POST /api/proprietarios/login - Login de proprietário (dashboard)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email e senha são obrigatórios",
      });
    }

    // Login via Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return res.status(401).json({
        status: "error",
        message: "Credenciais inválidas",
      });
    }

    // Verificar se é proprietário
    const { data: proprietario, error } = await supabase
      .from("proprietarios")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (error || !proprietario) {
      return res.status(403).json({
        status: "error",
        message: "Acesso negado: usuário não é proprietário",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Login de proprietário realizado com sucesso",
      data: {
        proprietario,
        session: authData.session,
        access_token: authData.session?.access_token,
      },
    });
  } catch (error) {
    console.error("Erro no login de proprietário:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// GET /api/proprietarios/me - Dados do proprietário atual
router.get("/me", verificarToken, verificarProprietario, async (req, res) => {
  try {
    res.json({
      status: "success",
      data: {
        proprietario: req.proprietario,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar proprietário:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// GET /api/proprietarios/academias - Listar academias do proprietário
router.get(
  "/academias",
  verificarToken,
  verificarProprietario,
  async (req, res) => {
    try {
      const academias = await obterAcademiasPorProprietario(
        req.proprietario.id
      );

      res.json({
        status: "success",
        data: { academias },
      });
    } catch (error) {
      console.error("Erro ao buscar academias:", error);
      res.status(500).json({
        status: "error",
        message: "Erro interno do servidor",
      });
    }
  }
);

// POST /api/proprietarios/academias - Criar nova academia
router.post(
  "/academias",
  verificarToken,
  verificarProprietario,
  async (req, res) => {
    try {
      const proprietarioId = req.proprietario.id;
      const {
        nome,
        descricao,
        endereco,
        telefone,
        email,
        latitude,
        longitude,
        horario_funcionamento,
        preco_base,
        imagem_url,
        status = "ativa",
        visibilidade = true,
      } = req.body;

      // Validação básica
      if (!nome || !endereco || !telefone) {
        return res.status(400).json({
          status: "error",
          message: "Nome, endereço e telefone são obrigatórios",
        });
      }

      const { data: academia, error } = await supabase
        .from("academias")
        .insert([
          {
            proprietario_id: proprietarioId,
            nome,
            descricao,
            endereco,
            telefone,
            email,
            latitude,
            longitude,
            horario_funcionamento,
            preco_base,
            imagem_url,
            status,
            visibilidade,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        status: "success",
        message: "Academia criada com sucesso",
        data: { academia },
      });
    } catch (error) {
      console.error("Erro ao criar academia:", error);
      res.status(500).json({
        status: "error",
        message: "Erro interno do servidor",
      });
    }
  }
);

// PUT /api/proprietarios/academias/:id - Atualizar academia
router.put(
  "/academias/:id",
  verificarToken,
  verificarProprietario,
  async (req, res) => {
    try {
      const academiaId = req.params.id;
      const proprietarioId = req.proprietario.id;
      const updateData = req.body;

      // Remover campos que não devem ser atualizados diretamente
      delete updateData.id;
      delete updateData.proprietario_id;
      delete updateData.criado_em;

      // Verificar se a academia pertence ao proprietário
      const { data: academiaExistente } = await supabase
        .from("academias")
        .select("id")
        .eq("id", academiaId)
        .eq("proprietario_id", proprietarioId)
        .single();

      if (!academiaExistente) {
        return res.status(404).json({
          status: "error",
          message: "Academia não encontrada",
        });
      }

      const { data: academia, error } = await supabase
        .from("academias")
        .update({
          ...updateData,
          atualizado_em: new Date().toISOString(),
        })
        .eq("id", academiaId)
        .eq("proprietario_id", proprietarioId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.json({
        status: "success",
        message: "Academia atualizada com sucesso",
        data: { academia },
      });
    } catch (error) {
      console.error("Erro ao atualizar academia:", error);
      res.status(500).json({
        status: "error",
        message: "Erro interno do servidor",
      });
    }
  }
);

// DELETE /api/proprietarios/academias/:id - Excluir academia
router.delete(
  "/academias/:id",
  verificarToken,
  verificarProprietario,
  async (req, res) => {
    try {
      const academiaId = req.params.id;
      const proprietarioId = req.proprietario.id;

      const { error } = await supabase
        .from("academias")
        .delete()
        .eq("id", academiaId)
        .eq("proprietario_id", proprietarioId);

      if (error) {
        throw error;
      }

      res.json({
        status: "success",
        message: "Academia excluída com sucesso",
      });
    } catch (error) {
      console.error("Erro ao excluir academia:", error);
      res.status(500).json({
        status: "error",
        message: "Erro interno do servidor",
      });
    }
  }
);

// GET /api/proprietarios/agendamentos - Agendamentos das academias do proprietário
router.get(
  "/agendamentos",
  verificarToken,
  verificarProprietario,
  async (req, res) => {
    try {
      const proprietarioId = req.proprietario.id;
      const { inicio, fim, status, academia_id } = req.query;

      let query = supabase
        .from("agendamentos")
        .select(
          `
        *,
        usuarios!inner(nome, email, telefone),
        academias!inner(nome, proprietario_id)
      `
        )
        .eq("academias.proprietario_id", proprietarioId);

      // Filtros opcionais
      if (inicio) {
        query = query.gte("horario_inicio", inicio);
      }
      if (fim) {
        query = query.lte("horario_inicio", fim);
      }
      if (status) {
        query = query.eq("status", status);
      }
      if (academia_id) {
        query = query.eq("academia_id", academia_id);
      }

      const { data: agendamentos, error } = await query.order(
        "horario_inicio",
        { ascending: false }
      );

      if (error) {
        throw error;
      }

      res.json({
        status: "success",
        data: { agendamentos },
      });
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      res.status(500).json({
        status: "error",
        message: "Erro interno do servidor",
      });
    }
  }
);

// PUT /api/proprietarios/agendamentos/:id/status - Atualizar status do agendamento
router.put(
  "/agendamentos/:id/status",
  verificarToken,
  verificarProprietario,
  async (req, res) => {
    try {
      const agendamentoId = req.params.id;
      const proprietarioId = req.proprietario.id;
      const { status } = req.body;

      if (!["confirmado", "cancelado", "concluido"].includes(status)) {
        return res.status(400).json({
          status: "error",
          message: "Status inválido",
        });
      }

      // Verificar se o agendamento pertence a uma academia do proprietário
      const { data: agendamento, error: selectError } = await supabase
        .from("agendamentos")
        .select(
          `
        *,
        academias!inner(proprietario_id)
      `
        )
        .eq("id", agendamentoId)
        .eq("academias.proprietario_id", proprietarioId)
        .single();

      if (selectError || !agendamento) {
        return res.status(404).json({
          status: "error",
          message: "Agendamento não encontrado",
        });
      }

      const { data: agendamentoAtualizado, error } = await supabase
        .from("agendamentos")
        .update({
          status,
          atualizado_em: new Date().toISOString(),
        })
        .eq("id", agendamentoId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.json({
        status: "success",
        message: "Status do agendamento atualizado com sucesso",
        data: { agendamento: agendamentoAtualizado },
      });
    } catch (error) {
      console.error("Erro ao atualizar status do agendamento:", error);
      res.status(500).json({
        status: "error",
        message: "Erro interno do servidor",
      });
    }
  }
);

module.exports = router;
