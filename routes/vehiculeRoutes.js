const express = require("express");
const { getVehicule, postVehicule, getMarque, postMarque } = require("../controllers/vehiculeController");
const router = express.Router();

router.get('/',getVehicule )
router.post('/', postVehicule)

//Marque
router.get('/marque', getMarque)
router.post('/marque', postMarque)

module.exports = router;