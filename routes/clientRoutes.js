const express = require("express");
const { postClient, getClients, postClientContact } = require("../controllers/clientController");
const router = express.Router();

router.get('/', getClients)
router.post('/client', postClient)
router.post('/clientContact', postClientContact)


module.exports = router;