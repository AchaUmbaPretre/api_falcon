const express = require("express");
const { getTraceur, postTraceur } = require("../controllers/traceurController");
const router = express.Router();

router.get('/', getTraceur)
router.post('/post_traceur', postTraceur)

module.exports = router;