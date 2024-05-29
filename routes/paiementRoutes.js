const express = require("express");
const { getPaiement, postPaiement, getMethode } = require("../controllers/paiementController");
const router = express.Router();

router.get('/methode', getMethode)
router.get('/', getPaiement)
router.post('/', postPaiement)

module.exports = router