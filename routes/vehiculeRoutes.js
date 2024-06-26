const express = require("express");
const { getVehicule, postVehicule, getMarque, postMarque, getVehiculeCount, deleteMarque, getModeleOne, getVehiculeCountJour, getVehiculeCountHier, getVehiculeCount7jours, getVehiculeCount30jours, getVehiculeCount1an } = require("../controllers/vehiculeController");
const verifyToken = require("../midllewares/verifyToken");
const router = express.Router();

router.get('/count', getVehiculeCount)
router.get('/countJour', getVehiculeCountJour)
router.get('/countHier', getVehiculeCountHier)
router.get('/count7jours', getVehiculeCount7jours)
router.get('/count30jours', getVehiculeCount30jours)
router.get('/count1an', getVehiculeCount1an)
router.get('/',getVehicule)
router.post('/', postVehicule)

//Marque
router.get('/marque', getMarque)
router.post('/marque', postMarque)
router.delete('/marque/:id', deleteMarque)


//Modele
router.get('/modele', getModeleOne)

module.exports = router;