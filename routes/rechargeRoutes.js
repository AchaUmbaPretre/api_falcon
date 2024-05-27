const express = require("express");
const { getRecharge, postRecharge, deleteRecharge } = require("../controllers/rechargeController");
const router = express.Router();

router.get('/', getRecharge)
router.post('/', postRecharge)
router.delete('/', deleteRecharge)

module.exports = router;