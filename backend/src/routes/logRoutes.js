import express from "express";
import { protect, isMCP } from "../middleware/authMiddleware.js";
import { getLogs } from "../controllers/logController.js";

const router = express.Router();

router.get("/", protect, isMCP, getLogs);

export default router;
