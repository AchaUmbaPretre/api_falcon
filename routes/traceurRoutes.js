const express = require("express");
const { getTraceur, postTraceur, getTraceurEtat, getModelTraceur, getTraceurCount, getTraceurHistorique } = require("../controllers/traceurController");
const router = express.Router();

router.get('/count', getTraceurCount)
router.get('/', getTraceur)
router.get('/historique', getTraceurHistorique)
router.get('/traceur_etat', getTraceurEtat)
router.get('/traceur_model', getModelTraceur)
router.post('/', postTraceur)

module.exports = router;