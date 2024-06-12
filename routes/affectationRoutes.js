const express = require("express");
const { getAffectations, postAffectations, getNumero, postNumero, getNumeroCount, getAffectationCount } = require("../controllers/affectationController");
const router = express.Router();

router.get('/count', getAffectationCount)
router.get('/', getAffectations)
router.post('/',postAffectations)

//Numero
router.get('/numero_count', getNumeroCount)
router.get('/numero', getNumero)
router.post('/numero_post', postNumero)

module.exports = router;