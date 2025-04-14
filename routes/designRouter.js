const express = require("express");
const { createDesign, getDesigns, deleteDesign, editDesign } = require("../controllers/designController");
const router = express.Router();
const upload = require('../utils/fileUploadUtil');

router.post("/",upload.single('file'), createDesign);
router.get('/', getDesigns);
router.put('/:id',upload.single('file'), editDesign);
router.delete('/:id', deleteDesign);
router.get('/:id', getDesigns);

module.exports = router;
