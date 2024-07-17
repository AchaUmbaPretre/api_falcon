const express = require("express");
const { getTraceur, postTraceur, getTraceurEtat, getModelTraceur, getTraceurCount, getTraceurHistorique, getTraceurCountJour, getTraceurCountHier, getTraceurCount7jours, getTraceurCount30jours, getTraceurCount1an, getTraceurInstall, getTraceurCountClient, putTraceur, getTraceurOne, getTraceurAll, getTraceurDemanteler, getTraceurNeuf, getTraceurSuspendu } = require("../controllers/traceurController");
const router = express.Router();

router.get('/count', getTraceurCount)
router.get('/countClient', getTraceurCountClient)
router.get('/traceurAll', getTraceurAll)
router.get('/countJour', getTraceurCountJour)
router.get('/countHier', getTraceurCountHier)
router.get('/count7jours', getTraceurCount7jours)
router.get('/count30jours', getTraceurCount30jours)
router.get('/count1an', getTraceurCount1an)
router.get('/traceurInstall', getTraceurInstall)
router.get('/', getTraceur)
router.get('/traceur_demanteler', getTraceurDemanteler)
router.get('/traceur_neuf', getTraceurNeuf)
router.get('/traceur_suspendu', getTraceurSuspendu)
router.get('/traceurOne', getTraceurOne)
router.get('/historique', getTraceurHistorique)
router.get('/traceur_etat', getTraceurEtat)
router.get('/traceur_model', getModelTraceur)
router.post('/', postTraceur)
router.put('/', putTraceur)

module.exports = router;