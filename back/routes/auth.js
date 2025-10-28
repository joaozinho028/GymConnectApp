const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /auth/login

// Endpoint temporário para debug
router.get("/debug-usuarios", authController.debugUsuarios);
router.post("/login", authController.login);
router.get("/buscarusuario", authController.buscarUsuario);

router.put("/editarusuario", authController.editarUsuario);
router.post("/uploadfoto", authController.uploadFotoUsuario);
router.delete("/excluirfoto", authController.excluirFotoUsuario);

module.exports = router;
