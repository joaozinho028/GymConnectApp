const express = require("express");
const {
  supabase,
  obterAcademiasPublicas,
  verificarToken,
} = require("../config/supabase");

const router = express.Router();

// GET /api/gyms - Listar academias públicas (para app móvel)
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      cidade = "",
      avaliacao_min = 0,
      latitude,
      longitude,
      raio = 0.01, // aproximadamente 1km
      preco_min,
      preco_max,
    } = req.query;

    // Filtros para academias públicas
    const filtros = {};

    if (latitude && longitude) {
      filtros.latitude = parseFloat(latitude);
      filtros.longitude = parseFloat(longitude);
      filtros.raio = parseFloat(raio);
    }

    if (preco_min) filtros.precoMin = parseFloat(preco_min);
    if (preco_max) filtros.precoMax = parseFloat(preco_max);
    if (avaliacao_min > 0) filtros.avaliacaoMin = parseFloat(avaliacao_min);

    let academias = await obterAcademiasPublicas(filtros);

    // Filtros adicionais que não estão na função helper
    if (search) {
      academias = academias.filter(
        (academia) =>
          academia.nome.toLowerCase().includes(search.toLowerCase()) ||
          academia.descricao?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (cidade) {
      academias = academias.filter((academia) =>
        academia.endereco.toLowerCase().includes(cidade.toLowerCase())
      );
    }

    // Paginação
    const total = academias.length;
    const offset = (page - 1) * limit;
    const paginatedAcademias = academias.slice(
      offset,
      offset + parseInt(limit)
    );

    res.json({
      status: "success",
      data: {
        academias: paginatedAcademias,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar academias:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// GET /api/gyms/:id - Buscar academia por ID (app móvel)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: academia, error } = await supabase
      .from("academias")
      .select(
        `
        *,
        planos_academia (*),
        galeria_academia (*)
      `
      )
      .eq("id", id)
      .eq("status", "ativa")
      .eq("visibilidade", true)
      .single();

    if (error || !academia) {
      return res.status(404).json({
        status: "error",
        message: "Academia não encontrada",
      });
    }

    res.json({
      status: "success",
      data: { academia },
    });
  } catch (error) {
    console.error("Erro ao buscar academia:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// GET /api/gyms/nearby/:lat/:lng - Buscar academias próximas
router.get("/nearby/:lat/:lng", async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const { raio = 0.01 } = req.query; // raio padrão de ~1km

    const filtros = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      raio: parseFloat(raio),
    };

    const academias = await obterAcademiasPublicas(filtros);

    res.json({
      status: "success",
      data: { academias },
    });
  } catch (error) {
    console.error("Erro ao buscar academias próximas:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// POST /api/gyms/:id/favoritar - Adicionar/remover academia dos favoritos
router.post("/:id/favoritar", verificarToken, async (req, res) => {
  try {
    const academiaId = req.params.id;
    const usuarioId = req.usuario.id;

    // Verificar se já está nos favoritos
    const { data: favoritoExistente } = await supabase
      .from("favoritos_usuario")
      .select("id")
      .eq("usuario_id", usuarioId)
      .eq("academia_id", academiaId)
      .single();

    if (favoritoExistente) {
      // Remover dos favoritos
      const { error } = await supabase
        .from("favoritos_usuario")
        .delete()
        .eq("usuario_id", usuarioId)
        .eq("academia_id", academiaId);

      if (error) throw error;

      res.json({
        status: "success",
        message: "Academia removida dos favoritos",
        data: { favoritado: false },
      });
    } else {
      // Adicionar aos favoritos
      const { error } = await supabase.from("favoritos_usuario").insert([
        {
          usuario_id: usuarioId,
          academia_id: academiaId,
        },
      ]);

      if (error) throw error;

      res.json({
        status: "success",
        message: "Academia adicionada aos favoritos",
        data: { favoritado: true },
      });
    }
  } catch (error) {
    console.error("Erro ao favoritar academia:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// GET /api/gyms/favoritos - Listar academias favoritas do usuário
router.get("/favoritos", verificarToken, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const { data: favoritos, error } = await supabase
      .from("favoritos_usuario")
      .select(
        `
        academia_id,
        criado_em,
        academias (
          *,
          planos_academia (*),
          galeria_academia (*)
        )
      `
      )
      .eq("usuario_id", usuarioId)
      .order("criado_em", { ascending: false });

    if (error) throw error;

    const academiasFavoritas = favoritos.map((fav) => ({
      ...fav.academias,
      favoritado_em: fav.criado_em,
    }));

    res.json({
      status: "success",
      data: { academias: academiasFavoritas },
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
