const express = require("express");
const { supabase, verificarToken } = require("../config/supabase");

const router = express.Router();

// POST /api/auth/register - Cadastro de usuário do app móvel
router.post("/register", async (req, res) => {
  try {
    const { email, password, nome, telefone, data_nascimento } = req.body;

    // Validação básica
    if (!email || !password || !nome) {
      return res.status(400).json({
        status: "error",
        message: "Email, senha e nome são obrigatórios",
      });
    }

    // Registrar usuário via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: nome,
          telefone: telefone || null,
          data_nascimento: data_nascimento || null,
          tipo_usuario: 'app_mobile'
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return res.status(409).json({
          status: "error",
          message: "Email já está em uso",
        });
      }
      throw authError;
    }

    // Inserir dados complementares na tabela usuarios
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .insert([
        {
          id: authData.user.id,
          email,
          nome,
          telefone: telefone || null,
          data_nascimento: data_nascimento || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar registro complementar:", error);
      // Continue mesmo com erro, pois o usuário já foi criado no Auth
    }

    res.status(201).json({
      status: "success",
      message: "Usuário criado com sucesso",
      data: {
        usuario: usuario || { 
          id: authData.user.id, 
          email: authData.user.email, 
          nome 
        },
        session: authData.session,
        access_token: authData.session?.access_token,
      },
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/login - Login de usuário do app móvel
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email e senha são obrigatórios",
      });
    }

    // Login via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return res.status(401).json({
        status: "error",
        message: "Credenciais inválidas",
      });
    }

    // Buscar dados complementares do usuário
    let { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Usuário não encontrado na tabela usuarios - criar entrada
      console.warn("Usuário autenticado mas não encontrado na tabela usuarios:", authData.user.id);
      
      const { data: novoUsuario } = await supabase
        .from("usuarios")
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            nome: authData.user.user_metadata?.nome || 'Usuário',
            telefone: authData.user.user_metadata?.telefone,
            data_nascimento: authData.user.user_metadata?.data_nascimento,
          },
        ])
        .select()
        .single();
      
      usuario = novoUsuario;
    }

    res.status(200).json({
      status: "success",
      message: "Login realizado com sucesso",
      data: {
        usuario: usuario || { 
          id: authData.user.id, 
          email: authData.user.email, 
          nome: authData.user.user_metadata?.nome || 'Usuário' 
        },
        session: authData.session,
        access_token: authData.session?.access_token,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/logout - Logout do usuário
router.post("/logout", verificarToken, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: "Logout realizado com sucesso",
    });
  } catch (error) {
    console.error("Erro no logout:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// GET /api/auth/me - Buscar dados do usuário atual
router.get("/me", verificarToken, async (req, res) => {
  try {
    const userId = req.usuario.id;

    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("id, email, nome, telefone, data_nascimento, criado_em")
      .eq("id", userId)
      .single();

    if (error || !usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuário não encontrado",
      });
    }

    res.json({
      status: "success",
      data: { usuario },
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// PUT /api/auth/profile - Atualizar perfil do usuário
router.put("/profile", verificarToken, async (req, res) => {
  try {
    const userId = req.usuario.id;
    const { nome, telefone, data_nascimento } = req.body;

    // Atualizar na tabela usuarios
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .update({
        nome: nome || undefined,
        telefone: telefone || undefined,
        data_nascimento: data_nascimento || undefined,
        atualizado_em: new Date().toISOString()
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Atualizar metadata no Supabase Auth também
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        nome: nome || undefined,
        telefone: telefone || undefined,
        data_nascimento: data_nascimento || undefined,
      }
    });

    if (authError) {
      console.warn("Erro ao atualizar metadata do usuário:", authError);
    }

    res.json({
      status: "success",
      message: "Perfil atualizado com sucesso",
      data: { usuario },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// POST /api/auth/refresh - Renovar token de acesso
router.post("/refresh", async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        status: "error",
        message: "Refresh token é obrigatório",
      });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (error) {
      return res.status(401).json({
        status: "error",
        message: "Refresh token inválido",
      });
    }

    res.json({
      status: "success",
      data: {
        session: data.session,
        access_token: data.session?.access_token,
      },
    });
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

module.exports = router;