const express = require("express");
const jwt = require("jsonwebtoken");
const { supabase } = require("../config/supabase");
const { v4: uuidv4 } = require("uuid");

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

// GET /api/appointments - Listar agendamentos do usuário
router.get("/", verifyToken, async (req, res) => {
  try {
    const { status = "all", date_from, date_to } = req.query;

    let query = supabase
      .from("appointments")
      .select(
        `
        *,
        gyms(id, name, address, phone)
      `
      )
      .eq("user_id", req.user.userId);

    // Filtro por status
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Filtro por data
    if (date_from) {
      query = query.gte("start_time", date_from);
    }
    if (date_to) {
      query = query.lte("start_time", date_to);
    }

    // Ordenar por data de início
    query = query.order("start_time", { ascending: true });

    const { data: appointments, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      status: "success",
      data: { appointments: appointments || [] },
    });
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// POST /api/appointments - Criar novo agendamento
router.post("/", verifyToken, async (req, res) => {
  try {
    const { gym_id, title, notes, start_time, end_time } = req.body;

    // Validação básica
    if (!gym_id || !title || !start_time || !end_time) {
      return res.status(400).json({
        status: "error",
        message: "gym_id, title, start_time e end_time são obrigatórios",
      });
    }

    // Verificar se a academia existe
    const { data: gym } = await supabase
      .from("gyms")
      .select("id")
      .eq("id", gym_id)
      .single();

    if (!gym) {
      return res.status(404).json({
        status: "error",
        message: "Academia não encontrada",
      });
    }

    // Verificar conflito de horário (mesmo usuário)
    const { data: conflicts } = await supabase
      .from("appointments")
      .select("id, title, start_time, end_time")
      .eq("user_id", req.user.userId)
      .eq("status", "confirmed")
      .or(`start_time.lte.${end_time},end_time.gte.${start_time}`);

    if (conflicts && conflicts.length > 0) {
      return res.status(409).json({
        status: "error",
        message: "Já existe um agendamento confirmado neste horário",
        conflicts,
      });
    }

    // Criar agendamento
    const appointmentId = uuidv4();
    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert([
        {
          id: appointmentId,
          user_id: req.user.userId,
          gym_id,
          title,
          notes: notes || null,
          start_time,
          end_time,
          status: "confirmed",
          created_at: new Date().toISOString(),
        },
      ])
      .select(
        `
        *,
        gyms(id, name, address, phone)
      `
      )
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      status: "success",
      message: "Agendamento criado com sucesso",
      data: { appointment },
    });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// PUT /api/appointments/:id - Atualizar agendamento
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, notes, start_time, end_time, status } = req.body;

    // Verificar se o agendamento existe e pertence ao usuário
    const { data: existing } = await supabase
      .from("appointments")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (!existing || existing.user_id !== req.user.userId) {
      return res.status(404).json({
        status: "error",
        message: "Agendamento não encontrado",
      });
    }

    // Montar dados para atualização
    const updateData = {};
    if (title) updateData.title = title;
    if (notes !== undefined) updateData.notes = notes;
    if (start_time) updateData.start_time = start_time;
    if (end_time) updateData.end_time = end_time;
    if (status) updateData.status = status;
    updateData.updated_at = new Date().toISOString();

    // Verificar conflito se datas foram alteradas
    if (start_time || end_time) {
      const checkStartTime = start_time || existing.start_time;
      const checkEndTime = end_time || existing.end_time;

      const { data: conflicts } = await supabase
        .from("appointments")
        .select("id, title")
        .eq("user_id", req.user.userId)
        .eq("status", "confirmed")
        .neq("id", id)
        .or(`start_time.lte.${checkEndTime},end_time.gte.${checkStartTime}`);

      if (conflicts && conflicts.length > 0) {
        return res.status(409).json({
          status: "error",
          message: "Conflito de horário com outro agendamento",
          conflicts,
        });
      }
    }

    // Atualizar agendamento
    const { data: appointment, error } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        gyms(id, name, address, phone)
      `
      )
      .single();

    if (error) {
      throw error;
    }

    res.json({
      status: "success",
      message: "Agendamento atualizado com sucesso",
      data: { appointment },
    });
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// DELETE /api/appointments/:id - Cancelar/deletar agendamento
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o agendamento existe e pertence ao usuário
    const { data: existing } = await supabase
      .from("appointments")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (!existing || existing.user_id !== req.user.userId) {
      return res.status(404).json({
        status: "error",
        message: "Agendamento não encontrado",
      });
    }

    // Deletar agendamento
    const { error } = await supabase.from("appointments").delete().eq("id", id);

    if (error) {
      throw error;
    }

    res.json({
      status: "success",
      message: "Agendamento deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// GET /api/appointments/:id - Buscar agendamento específico
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: appointment, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        gyms(id, name, address, phone, working_hours)
      `
      )
      .eq("id", id)
      .eq("user_id", req.user.userId)
      .single();

    if (error || !appointment) {
      return res.status(404).json({
        status: "error",
        message: "Agendamento não encontrado",
      });
    }

    res.json({
      status: "success",
      data: { appointment },
    });
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

module.exports = router;
