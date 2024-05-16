const express = require("express");
const { getOperation, postOperation } = require("../controllers/operationController");
const router = express.Router();

router.get('/', getOperation)
router.post('/', postOperation)

module.exports = router