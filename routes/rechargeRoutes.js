const express = require("express");
const { getRecharge, postRecharge, deleteRecharge, getRechargeClientTotal } = require("../controllers/rechargeController");
const router = express.Router();

router.get('/rechargerClient', getRechargeClientTotal)
router.get('/rechargerNumero', getRechargeClientTotal)
router.get('/', getRecharge)
router.post('/', postRecharge)
router.delete('/', deleteRecharge)

module.exports = router;