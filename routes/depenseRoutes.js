const express = require("express");
const { getDepense, postDepense, deleteDepense, getTypeDepense, getPaiementMois, getDepenseMois, getDepenseAllMois } = require("../controllers/depenseController");
const router = express.Router();

router.get('/',getDepense)
router.get('/depenseAll',getDepenseAllMois)
router.get('/type',getTypeDepense)
router.post('/',postDepense)
router.delete('/',deleteDepense)

router.get('/paiementMois',getPaiementMois)
router.get('/depenseMois',getDepenseMois)

module.exports = router;