// backend/routes/projetos.js
const express = require('express');
const router = express.Router();   // <-- aqui tem que ser Router() com R maiúsculo
const ctrl = require('../controllers/projetosController');

router.get('/', ctrl.listarProjetos);
router.get('/:id', ctrl.obterProjeto);
router.post('/', ctrl.criarProjeto);
router.put('/:id', ctrl.atualizarProjeto);
router.delete('/:id', ctrl.deletarProjeto);

module.exports = router;
