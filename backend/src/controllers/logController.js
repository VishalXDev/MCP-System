import SystemLog from "../models/SystemLog.js";

export const getLogs = async (req, res) => {
  try {
    const logs = await SystemLog.find().populate("user", "name email").sort({ timestamp: -1 }).limit(50);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Error fetching logs", error: error.message });
  }
};
