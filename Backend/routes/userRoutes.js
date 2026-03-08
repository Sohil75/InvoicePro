const express = require("express");
const router= express.Router();

const {changePassword} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.put("/change-password", auth,changePassword);

module.exports = router;