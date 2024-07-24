const express = require("express");
const { getDepense, postDepense, deleteDepense, getTypeDepense, getPaiementMois, getDepenseMois, getDepenseAllMois, getDepenseJour, getDepenseHier, getDepense7jours, getDepense30jours, getDepense1an, getDepenseTotalTout } = require("../controllers/depenseController");
const router = express.Router();

router.get('/',getDepense)
router.get('/countJour',getDepenseJour)
router.get('/countHier',getDepenseHier)
router.get('/count7jours',getDepense7jours)
router.get('/count30jours',getDepense30jours)
router.get('/count1an',getDepense1an)
router.get('/depenseAll',getDepenseAllMois)
router.get('/depenseTout',getDepenseTotalTout)
router.get('/type',getTypeDepense)
router.post('/',postDepense)
router.delete('/',deleteDepense)

router.get('/paiementMois',getPaiementMois)
router.get('/depenseMois',getDepenseMois)

module.exports = router;