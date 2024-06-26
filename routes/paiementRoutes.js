const express = require("express");
const { getPaiement, postPaiement, getMethode, getDette, postDette, getPaiementOne } = require("../controllers/paiementController");
const router = express.Router();

router.get('/methode', getMethode)
router.get('/', getPaiement)
router.get('/one', getPaiementOne)

const multer = require('multer'); 
const upload = multer({ dest: 'public/uploads/' });

router.post('/',upload.single('document'), postPaiement)

//Dette

router.get('/dette', getDette)
router.post('/dette', postDette)

module.exports = router