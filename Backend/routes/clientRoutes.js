const express = require("express");
const router = express.Router();

const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  recentClients,
} = require("../controllers/clientController");
const authMiddleware = require("../middleware/authMiddleware");
router.use(authMiddleware);

router.post("/", createClient);
router.get("/", getClients);
router.get("/recent", recentClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
