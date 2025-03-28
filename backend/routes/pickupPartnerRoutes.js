import express from "express";
import { addPickupPartner, getPickupPartners } from "../controllers/pickupPartnerController.js";

const router = express.Router();

router.post("/", addPickupPartner);
router.get("/", getPickupPartners);

export default router;
