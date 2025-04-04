import express from "express";
import { updateUser, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.put("/:id", protect, updateUser); // Update user
router.delete("/:id", protect, deleteUser); // Delete user
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  addPartner,
  deleteUser,
} = require("../controllers/userController");

const auth = require("../middleware/auth");

router.get("/", auth, getAllUsers);
router.post("/partner", auth, addPartner);
router.delete("/:id", auth, deleteUser);

module.exports = router;

export default router;
