const express = require("express");
const { getMenu, getPermissions, PostUserPermission, permissions } = require("../controllers/menuController");
const router = express.Router();

router.get('/', getMenu)
router.get('/permissions', permissions)
router.get('/user-permissions', getPermissions)
router.post('/user-permissions', PostUserPermission)

module.exports = router;