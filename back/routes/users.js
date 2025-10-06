const express = require("express");
const jwt = require("jsonwebtoken");
const { supabase } = require("../config/supabase");

const router = express.Router();

// Middleware para verificar token JWT
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Token de acesso requerido",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Token inválido",
    });
  }
};

// GET /api/users/profile - Buscar perfil do usuário
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select(
        `
        id, email, name, phone, avatar_url, created_at, last_login,
        favorites:user_favorites(
          gym_id,
          gyms(*)
        ),
        appointments:appointments(
          *,
          gyms(name, address)
        )
      `
      )
      .eq("id", req.user.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        status: "error",
        message: "Usuário não encontrado",
      });
    }

    res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// PUT /api/users/profile - Atualizar perfil do usuário
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    const { data: user, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", req.user.userId)
      .select("id, email, name, phone, avatar_url, created_at")
      .single();

    if (error) {
      throw error;
    }

    res.json({
      status: "success",
      message: "Perfil atualizado com sucesso",
      data: { user },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// POST /api/users/favorites/:gymId - Adicionar academia aos favoritos
router.post("/favorites/:gymId", verifyToken, async (req, res) => {
  try {
    const { gymId } = req.params;

    // Verificar se a academia existe
    const { data: gym } = await supabase
      .from("gyms")
      .select("id")
      .eq("id", gymId)
      .single();

    if (!gym) {
      return res.status(404).json({
        status: "error",
        message: "Academia não encontrada",
      });
    }

    // Verificar se já está nos favoritos
    const { data: existing } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", req.user.userId)
      .eq("gym_id", gymId)
      .single();

    if (existing) {
      return res.status(409).json({
        status: "error",
        message: "Academia já está nos favoritos",
      });
    }

    // Adicionar aos favoritos
    const { error } = await supabase.from("user_favorites").insert([
      {
        user_id: req.user.userId,
        gym_id: gymId,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      throw error;
    }

    res.status(201).json({
      status: "success",
      message: "Academia adicionada aos favoritos",
    });
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// DELETE /api/users/favorites/:gymId - Remover academia dos favoritos
router.delete("/favorites/:gymId", verifyToken, async (req, res) => {
  try {
    const { gymId } = req.params;

    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", req.user.userId)
      .eq("gym_id", gymId);

    if (error) {
      throw error;
    }

    res.json({
      status: "success",
      message: "Academia removida dos favoritos",
    });
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// GET /api/users/favorites - Listar academias favoritas
router.get("/favorites", verifyToken, async (req, res) => {
  try {
    const { data: favorites, error } = await supabase
      .from("user_favorites")
      .select(
        `
        created_at,
        gyms(
          *,
          plans:gym_plans(*),
          gallery:gym_gallery(*)
        )
      `
      )
      .eq("user_id", req.user.userId);

    if (error) {
      throw error;
    }

    res.json({
      status: "success",
      data: {
        favorites:
          favorites?.map((fav) => ({
            ...fav.gyms,
            favorited_at: fav.created_at,
          })) || [],
      },
    });
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

module.exports = router;
