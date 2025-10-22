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
module.exports = { login, debugUsuarios };
