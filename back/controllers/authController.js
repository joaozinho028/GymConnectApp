// PUT /auth/editarusuario
const editarUsuario = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token não fornecido." });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Dados enviados para atualização
    const dadosAtualizados = req.body;

    // Atualizar usuário no banco
    const { error } = await supabase
      .from("usuarios")
      .update(dadosAtualizados)
      .eq("id_usuario", decoded.id)
      .eq("status_usuario", true);

    if (error) throw error;
    return res.json({ message: "Dados atualizados com sucesso." });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Erro ao atualizar usuário.", error: err.message });
  }
};
// Endpoint temporário para debug: listar todos os usuários ativos
const debugUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id_usuario, email_usuario, status_usuario");
    if (error) throw error;
    return res.json({ usuarios: data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar usuários.", error: err.message });
  }
};

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// POST /auth/login
const login = async (req, res) => {
  const { email, senha } = req.body;
  console.log("Tentativa de login:", { email, senha });
  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }
  try {
    // Buscar usuário pelo email
    const { data: usuarios, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email_usuario", email)
      .eq("status_usuario", true)
      .limit(1);
    console.log("Resultado consulta usuarios:", usuarios, "Erro:", error);
    if (error) throw error;
    if (!usuarios || usuarios.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }
    const usuario = usuarios[0];
    // Verificar senha usando bcrypt
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_usuario);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Senha incorreta." });
    }
    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // Retornar dados do usuário (exceto senha) e token
    const { senha_usuario, ...usuarioSemSenha } = usuario;
    return res.json({ usuario: usuarioSemSenha, token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao autenticar.", error: err.message });
  }
};
// GET /auth/me
const buscarUsuario = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token não fornecido." });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário pelo id
    const { data: usuarios, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id_usuario", decoded.id)
      .eq("status_usuario", true)
      .limit(1);

    if (error) throw error;
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    const usuario = usuarios[0];
    const { senha_usuario, ...usuarioSemSenha } = usuario;
    return res.json({ usuario: usuarioSemSenha });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token inválido ou expirado.", error: err.message });
  }
};

// POST /auth/uploadfoto
const uploadFotoUsuario = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token não fornecido." });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Espera receber o arquivo como base64 ou buffer
    const { fotoBase64 } = req.body;
    if (!fotoBase64) {
      return res.status(400).json({ message: "Foto não enviada." });
    }
    // Nome do arquivo: usuario_{id}.jpg
    const fileName = `usuario_${decoded.id}.jpg`;
    // Upload para o bucket 'foto-usuario'
    const { data, error } = await supabase.storage
      .from("foto-usuario")
      .upload(fileName, Buffer.from(fotoBase64, "base64"), {
        contentType: "image/jpeg",
        upsert: true,
      });
    if (error) throw error;
    // Gerar URL pública
    const { publicURL } = supabase.storage
      .from("foto-usuario")
      .getPublicUrl(fileName).data;
    // Atualizar campo foto_usuario na tabela
    await supabase
      .from("usuarios")
      .update({ foto_usuario: publicURL })
      .eq("id_usuario", decoded.id)
      .eq("status_usuario", true);
    return res.json({ message: "Foto enviada com sucesso.", url: publicURL });
  } catch (err) {
    return res.status(500).json({ message: "Erro ao enviar foto.", error: err.message });
  }
};

// DELETE /auth/excluirfoto
const excluirFotoUsuario = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token não fornecido." });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const fileName = `usuario_${decoded.id}.jpg`;
    // Excluir do bucket
    const { error } = await supabase.storage
      .from("foto-usuario")
      .remove([fileName]);
    if (error) throw error;
    // Remover campo foto_usuario na tabela
    await supabase
      .from("usuarios")
      .update({ foto_usuario: null })
      .eq("id_usuario", decoded.id)
      .eq("status_usuario", true);
    return res.json({ message: "Foto excluída com sucesso." });
  } catch (err) {
    return res.status(500).json({ message: "Erro ao excluir foto.", error: err.message });
  }
};

module.exports = { login, debugUsuarios, buscarUsuario, editarUsuario, uploadFotoUsuario, excluirFotoUsuario };
