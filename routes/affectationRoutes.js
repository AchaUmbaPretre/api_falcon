const express = require("express");
const { getAffectations, postAffectations } = require("../controllers/affectationController");
const router = express.Router();

router.get('/', getAffectations)
router.post('/form_affectation',postAffectations)

module.exports = router;