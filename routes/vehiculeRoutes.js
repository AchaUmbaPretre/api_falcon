const express = require("express");
const { getVehicule, postVehicule, getMarque, postMarque, getVehiculeCount, deleteMarque } = require("../controllers/vehiculeController");
const router = express.Router();

router.get('/count', getVehiculeCount)
router.get('/',getVehicule)
router.post('/', postVehicule)

//Marque
router.get('/marque', getMarque)
router.post('/marque', postMarque)
router.delete('/marque/:id', deleteMarque)

module.exports = router;