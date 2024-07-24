const express = require("express");
const { getPaiement, postPaiement, getMethode, getDette, postDette, getPaiementOne, getPaiementMois, getPaiementTout } = require("../controllers/paiementController");
const router = express.Router();

router.get('/methode', getMethode)
router.get('/', getPaiement)
router.get('/mois', getPaiementMois)
router.get('/one', getPaiementOne)
router.get('/paimentTout', getPaiementTout)

const multer = require('multer'); 
const upload = multer({ dest: 'public/uploads/' });

router.post('/',upload.single('document'), postPaiement)

//Dette
router.get('/dette', getDette)
router.post('/dette', postDette)

module.exports = router