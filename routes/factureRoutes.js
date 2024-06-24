const express = require("express");
const { getFacture, getTaxes, getRemises, postFacture } = require("../controllers/factureController");
const router = express.Router();

router.get('/', getFacture)
router.post('/',postFacture)
router.get('/taxes',getTaxes)
router.get('/remises',getRemises)

module.exports = router;