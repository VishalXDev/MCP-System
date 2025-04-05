import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../src/models/user.js";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
  createAdmin();
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

async function createAdmin() {
  try {
    const existing = await User.findOne({ email: "admin@mcp.com" });
    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = new User({
      name: "Super Admin",
      email: "admin@mcp.com",
      phone: "9999999999",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("✅ Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}
