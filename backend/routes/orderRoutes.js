import express from "express";
import { assignOrder, getOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", assignOrder);
router.get("/", getOrders);

export default router;
