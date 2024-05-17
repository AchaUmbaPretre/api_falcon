const express = require("express");
const { registerController, loginController, getPersonnel } = require("../controllers/userController");
const router = express.Router();

router.post('/register',registerController )
router.post('/login', loginController)

//Personnel
router.get('/', getPersonnel)

module.exports = router;