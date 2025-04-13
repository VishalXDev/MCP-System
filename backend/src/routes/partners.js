import express from "express"; // Use ES module import for express
import PickupPartner from "../models/PickupPartner.js"; // Make sure to use ".js" for module imports
const router = express.Router();

// ✅ Get all pickup partners
router.get("/", async (req, res) => {
  try {
    const partners = await PickupPartner.find();
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pickup partners" });
  }
});

// ✅ Add a new pickup partner
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, password, commission } = req.body;
    const partner = new PickupPartner({ name, email, phone, password, commission });
    await partner.save();
    res.status(201).json(partner);
  } catch (err) {
    res.status(400).json({ error: "Error adding pickup partner", details: err.message });
  }
});

// ✅ Delete a pickup partner
router.delete("/:id", async (req, res) => {
  try {
    await PickupPartner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error deleting pickup partner" });
  }
});

// ✅ Update commission
router.patch("/:id/commission", async (req, res) => {
  try {
    const { commission } = req.body;
    const updated = await PickupPartner.findByIdAndUpdate(
      req.params.id,
      { commission },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Error updating commission" });
  }
});

export default router; // Export the router as default
