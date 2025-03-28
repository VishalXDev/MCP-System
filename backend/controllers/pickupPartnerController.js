import PickupPartner from "../models/PickupPartner.js";

// Add Pickup Partner
export const addPickupPartner = async (req, res) => {
  try {
    const partner = new PickupPartner(req.body);
    await partner.save();
    res.status(201).json(partner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Pickup Partners
export const getPickupPartners = async (req, res) => {
  const partners = await PickupPartner.find();
  res.json(partners);
};
