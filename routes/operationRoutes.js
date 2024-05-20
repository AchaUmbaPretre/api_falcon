const express = require("express");
const { getOperation, postOperation, getSite, getTypeOperation } = require("../controllers/operationController");
const router = express.Router();

router.get('/', getOperation)

const multer = require('multer'); 
const upload = multer({ dest: 'public/uploads/' });


router.post('/', upload.fields([{ name: 'photo_plaque', maxCount: 1 }, { name: 'photo_traceur', maxCount: 1 }]), postOperation);

//Site
router.get('/site', getSite)

//Type d'operations
router.get('/type_operation', getTypeOperation)

module.exports = router