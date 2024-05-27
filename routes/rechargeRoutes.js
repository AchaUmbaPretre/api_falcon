const express = require("express");
const { getRecharge, postRecharge, deleteRecharge, getRechargeClientTotal, getRechargeClientOne } = require("../controllers/rechargeController");
const router = express.Router();

router.get('/rechargerClient', getRechargeClientTotal)
router.get('/rechargerClientOne', getRechargeClientOne)
router.get('/', getRecharge)
router.post('/', postRecharge)
router.delete('/', deleteRecharge)

module.exports = router;