const express = require("express");
const { postClient, getClients, postClientContact, getClientAll } = require("../controllers/clientController");
const router = express.Router();

router.get('/', getClients)
router.get('/client_contact', getClientAll)
router.post('/client', postClient)
router.post('/clientContact', postClientContact)


module.exports = router;