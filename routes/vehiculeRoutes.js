const express = require("express");
const { getVehicule, postVehicule, getMarque } = require("../controllers/vehiculeController");
const router = express.Router();

router.get('/',getVehicule )
router.post('/', postVehicule)

//Marque
router.get('/marque', getMarque)

module.exports = router;