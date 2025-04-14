const express = require("express");
const { createForm, getForm } = require("../controllers/formController");
const router = express.Router();
const upload = require('../utils/fileUploadUtil');

router.post("/", createForm);
router.get("/:id?", getForm);


module.exports = router;
