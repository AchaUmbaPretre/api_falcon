const express = require("express");
const { getAffectations, postAffectations, getNumero } = require("../controllers/affectationController");
const router = express.Router();

router.get('/', getAffectations)
router.post('/',postAffectations)

//Numero
router.get('/numero', getNumero)

module.exports = router;