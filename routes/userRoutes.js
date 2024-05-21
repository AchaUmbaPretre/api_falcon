const express = require("express");
const { registerController, loginController, getPersonnel, logout } = require("../controllers/userController");
const router = express.Router();

router.post('/register',registerController )
router.post('/login', loginController)
router.post('/logout', logout);

//Personnel
router.get('/', getPersonnel)

module.exports = router;