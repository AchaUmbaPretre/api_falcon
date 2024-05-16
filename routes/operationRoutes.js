const express = require("express");
const { getOperation, postOperation } = require("../controllers/operationController");
const router = express.Router();

router.get('/', getOperation)
router.post('/post_operation', postOperation)

module.exports = router