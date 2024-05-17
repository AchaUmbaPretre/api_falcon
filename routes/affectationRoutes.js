const express = require("express");
const { getAffectations, postAffectations, getNumero, postNumero } = require("../controllers/affectationController");
const router = express.Router();

router.get('/', getAffectations)
router.post('/',postAffectations)

//Numero
router.get('/numero', getNumero)
router.post('/numero_post', postNumero)

module.exports = router;