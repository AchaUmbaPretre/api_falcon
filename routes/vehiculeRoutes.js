const express = require("express");
const { getVehicule, postVehicule, getMarque, postMarque, getVehiculeCount, deleteMarque, getModeleOne } = require("../controllers/vehiculeController");
const verifyToken = require("../midllewares/verifyToken");
const router = express.Router();

router.get('/count', getVehiculeCount)
router.get('/',getVehicule)
router.post('/', postVehicule)

//Marque
router.get('/marque', getMarque)
router.post('/marque', postMarque)
router.delete('/marque/:id', deleteMarque)


//Modele
router.get('/modele', getModeleOne)

module.exports = router;