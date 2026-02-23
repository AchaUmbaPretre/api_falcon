const express = require("express");
const { getEvents, getFalcon } = require("../controllers/monitoringController");
const router = express.Router();

router.get('/events', getEvents)
router.get('/falcon', getFalcon)

module.exports = router;