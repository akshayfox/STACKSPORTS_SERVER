const express = require("express");
const { createDesign, getDesigns, deleteDesign, editDesign, copyDesign } = require("../controllers/designController");
const router = express.Router();
const upload = require('../utils/fileUploadUtil');
const { verifyToken } = require("../controllers/authController");

router.post("/",upload.single('file'), createDesign);
router.get('/', getDesigns);
router.put('/:id',upload.single('file'), editDesign);
router.delete('/:id', deleteDesign);
router.get('/:id', getDesigns);
router.post('/:id/copy', verifyToken, copyDesign); 

module.exports = router;
