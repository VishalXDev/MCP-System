import User from "../models/user.js";
import bcrypt from "bcryptjs";

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Create new pickup partner
// @route   POST /api/users/partners
// @access  Private/Admin
export const addPartner = async (req, res) => {
  try {
    const { name, email, phone, password, commissionRate } = req.body;

    // Validation
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const partner = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "pickupPartner",
      commissionRate: commissionRate || 0.2 // Default commission
    });

    // Remove password from response
    partner.password = undefined;

    res.status(201).json({
      success: true,
      message: "Partner created successfully",
      data: partner
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Update user details
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, commissionRate } = req.body;

    // Find user and check permissions
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Authorization check (user can only update their own profile unless admin)
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user"
      });
    }

    // Update allowed fields
    const updates = {};
    if (name) updates.name = name;
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use"
        });
      }
      updates.email = email;
    }
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone number already in use"
        });
      }
      updates.phone = phone;
    }
    if (commissionRate && req.user.role === 'admin') {
      updates.commissionRate = commissionRate;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Prevent deletion of admin accounts
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin accounts"
      });
    }

    await user.remove();
    
    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};