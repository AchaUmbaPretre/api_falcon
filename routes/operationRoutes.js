const express = require("express");
const { getOperation, postOperation, getSite, getTypeOperation, getOperationCount, postSite, postSignature, getOperationCountJour, getOperationCountHier, getOperationCount7jours, getOperationCount30jours, getOperationCount1an, envoieEmail, getOperationRapport, getOperationRapportCount } = require("../controllers/operationController");
const router = express.Router();

router.get('/count', getOperationCount)
router.get('/countJour', getOperationCountJour)
router.get('/countHier', getOperationCountHier)
router.get('/count7jours', getOperationCount7jours)
router.get('/count30jours', getOperationCount30jours)
router.get('/count1an', getOperationCount1an)
router.get('/', getOperation)
router.get('/operation_rapport', getOperationRapport)
router.get('/operation_rapport_count', getOperationRapportCount)

const multer = require('multer'); 
const upload = multer({ dest: 'public/uploads/' });


router.post('/', upload.fields([{ name: 'photo_plaque', maxCount: 1 }, { name: 'photo_traceur', maxCount: 1 }]), postOperation);

//Site
router.get('/site', getSite)
router.get('/siteOne', getSite)
router.post('/site', postSite)

//Type d'operations
router.get('/type_operation', getTypeOperation)

//Signature
router.post('/signature', postSignature)

router.post('/send-operation-email', envoieEmail)

module.exports = router