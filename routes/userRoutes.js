const express = require("express");
const { registerController, loginController,putPersonnel, getPersonnel, logout, detailForgot, updateUser, getPersonnelOne } = require("../controllers/userController");
const router = express.Router();

router.post('/register',registerController )
router.post('/login', loginController)
router.post('/logout', logout);

//Personnel
router.get('/', getPersonnel)
router.get('/one', getPersonnelOne)
router.put('/update', putPersonnel)


//Auth
router.post('/detail_forgot', detailForgot)
router.put('/password_reset/:id', updateUser)

module.exports = router;