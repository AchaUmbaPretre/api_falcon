const express = require("express");
const { getMenu, getPermissions, PostUserPermission, permissions, menusAll, putPermission, menusAllPermission } = require("../controllers/menuController");
const router = express.Router();

router.get('/menuAll', menusAll)
router.get('/menuAllPermission', menusAllPermission)
router.get('/', getMenu)
router.get('/permissions', permissions)
router.get('/user-permissions', getPermissions)
router.post('/user-permissions', PostUserPermission)
/* router.put('/:userId/permissions/permissionUpdate/:optionId', putPermission) */
router.put('/:userId/permissions/:optionId', putPermission)
module.exports = router;