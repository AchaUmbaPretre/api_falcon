const express = require("express");
const { getOperation, postOperation, getSite } = require("../controllers/operationController");
const router = express.Router();

router.get('/', getOperation)
router.post('/', postOperation)

//Site
router.get('/site', getSite)

module.exports = router