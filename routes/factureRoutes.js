const express = require("express");
const { getFacture, getTaxes, getRemises, postFacture, postPaiementPaye, getOperationFacture, getTarif, getClientTarif } = require("../controllers/factureController");
const router = express.Router();

router.get('/', getFacture)
router.get('/tarif', getTarif)
router.get('/clientTarif', getClientTarif)
router.post('/',postFacture)
router.get('/taxes',getTaxes)
router.get('/remises',getRemises)
router.get('/factureOperation',getOperationFacture)

//Paiement
router.post('/paiement',postPaiementPaye)

module.exports = router;