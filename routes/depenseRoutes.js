const express = require("express");
const { getDepense, postDepense, deleteDepense } = require("../controllers/depenseController");
const router = express.Router();

router.get('/',getDepense)
router.post('/',postDepense)
router.delete('/',deleteDepense)

module.exports = router;