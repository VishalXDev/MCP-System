const express = require("express");
const router = express.Router();
const autoAssignOrder = require("../services/autoAssignService");

// POST /orders/:id/auto-assign
router.post("/:id/auto-assign", async (req, res) => {
  try {
    const order = await autoAssignOrder(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message || "Auto-assign failed" });
  }
});
import API from "../utils/axios";

export const autoAssignOrder = async (orderId) => {
  const res = await API.post(`/orders/${orderId}/auto-assign`);
  return res.data;
};
