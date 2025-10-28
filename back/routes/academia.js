const express = require('express');
const router = express.Router();
const academiaController = require('../controllers/academiaController');

// Rota para buscar academias próximas
router.get('/proximas', academiaController.getAcademiasProximas);

module.exports = router;
