const express = require("express");
const { getOperation, postOperation, getSite, getTypeOperation } = require("../controllers/operationController");
const multer = require('multer'); 
const upload = multer({ dest: 'public/uploads/' });
const router = express.Router();

router.get('/', getOperation)
router.post('/',upload.single('img'), postOperation)

//Site
router.get('/site', getSite)

//Type d'operations
router.get('/type_operation', getTypeOperation)

module.exports = router