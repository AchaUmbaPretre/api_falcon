const express = require("express");
const { getPaiement, postPaiement, getMethode, getDette, postDette } = require("../controllers/paiementController");
const router = express.Router();

router.get('/methode', getMethode)
router.get('/', getPaiement)
router.post('/', postPaiement)

//Dette

router.get('/dette', getDette)
router.post('/dette', postDette)

module.exports = router