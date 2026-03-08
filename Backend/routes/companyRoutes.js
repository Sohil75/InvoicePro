const express = require("express");
const router =express.Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");

const {
    createCompany,
    getCompany,
    updateCompany,
}= require("../controllers/companyController");

router.post("/",auth,upload.single("logo"),createCompany);
router.get("/",auth,getCompany);

module.exports = router;