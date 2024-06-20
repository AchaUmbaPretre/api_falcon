const express = require("express");
const { postClient, getClients, postClientContact, getClientAll, getClientCount, deleteClient, getClientCountJour, getClientCountHier, getClientCount7jours, getClientCount30jours, getClientCount1an } = require("../controllers/clientController");
const router = express.Router();

router.get('/count', getClientCount)
router.get('/countJour', getClientCountJour)
router.get('/countHier', getClientCountHier)
router.get('/count7jours', getClientCount7jours)
router.get('/count30Jours', getClientCount30jours)
router.get('/count1an', getClientCount1an)
router.get('/', getClients)
router.get('/client_contact', getClientAll)
router.post('/client', postClient)
router.post('/clientContact', postClientContact)

router.delete('/:id', deleteClient)

module.exports = router;