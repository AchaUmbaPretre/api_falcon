const express = require("express");
const { getFacture, getTaxes, getRemises, postFacture, postPaiementPaye, getOperationFacture, getTarif, getClientTarif, getClientTarifOne, getFactureOne } = require("../controllers/factureController");
const router = express.Router();

router.get('/', getFacture)
router.get('/One', getFactureOne)
router.get('/tarif', getTarif)
router.get('/clientTarif', getClientTarif)
router.get('/clientTarifOne', getClientTarifOne)
router.post('/',postFacture)
router.get('/taxes',getTaxes)
router.get('/remises',getRemises)
router.get('/factureOperation',getOperationFacture)

//Paiement
router.post('/paiement',postPaiementPaye)

module.exports = router;