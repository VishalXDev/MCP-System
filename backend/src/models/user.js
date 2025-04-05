import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"],
      trim: true
    },
    email: { 
      type: String, 
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => /^\S+@\S+\.\S+$/.test(v),
        message: "Invalid email format"
      }
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: (v) => /^[0-9]{10,15}$/.test(v),
        message: "Invalid phone number"
      }
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "mcp", "pickupPartner"],
        message: "Invalid user role"
      },
      default: "pickupPartner",
      required: true
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: [0, "Balance cannot be negative"]
    },
    commissionRate: {
      type: Number,
      default: 0.2,
      min: [0, "Commission cannot be negative"],
      max: [1, "Commission cannot exceed 100%"]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: Date
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password verification method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for formatted wallet balance
userSchema.virtual("formattedBalance").get(function() {
  return `₹${this.walletBalance.toFixed(2)}`;
});

// Only needed indexes
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

const User = mongoose.model("User", userSchema);
export default User;
