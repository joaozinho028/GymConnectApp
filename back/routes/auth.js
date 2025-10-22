const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /auth/login

// Endpoint temporário para debug
router.get("/debug-usuarios", authController.debugUsuarios);
router.post("/login", authController.login);

module.exports = router;
