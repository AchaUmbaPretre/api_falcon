const express = require("express");
const { postClient, getClients, postClientContact, getClientAll, getClientCount, deleteClient } = require("../controllers/clientController");
const router = express.Router();

router.get('/count', getClientCount)
router.get('/', getClients)
router.get('/client_contact', getClientAll)
router.post('/client', postClient)
router.post('/clientContact', postClientContact)

router.delete('/:id', deleteClient)

module.exports = router;