const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
} = require("../controllers/transactionController");

const auth = require("../middleware/auth");

router.get("/:userId", auth, getTransactions);
router.post("/", auth, addTransaction);

module.exports = router;
