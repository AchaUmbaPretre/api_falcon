const express = require("express");
const { getVehicule, postVehicule } = require("../controllers/vehiculeController");
const router = express.Router();

router.get('/',getVehicule )
router.post('/', postVehicule)

module.exports = router;