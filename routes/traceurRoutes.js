const express = require("express");
const { getTraceur, postTraceur, getTraceurEtat, getModelTraceur, getTraceurCount } = require("../controllers/traceurController");
const router = express.Router();

router.get('/count', getTraceurCount)
router.get('/', getTraceur)
router.get('/traceur_etat', getTraceurEtat)
router.get('/traceur_model', getModelTraceur)
router.post('/', postTraceur)

module.exports = router;