const express = require("express");
const { getTraceur, postTraceur, getTraceurEtat } = require("../controllers/traceurController");
const router = express.Router();

router.get('/', getTraceur)
router.get('/traceur_etat', getTraceurEtat)
router.post('/post_traceur', postTraceur)

module.exports = router;