import SystemLog from "../models/SystemLog.js";

export const logAction = async (user, action, details = {}) => {
  try {
    await SystemLog.create({ user, action, details });
  } catch (error) {
    console.error("Error logging action:", error);
  }
};
