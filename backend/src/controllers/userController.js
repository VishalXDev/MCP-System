import User from "../models/user.js";  // Adjust the relative path if necessary
// @desc Update user details
// @route PUT /api/users/:id
// @access Private
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Allow updates only to specific fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
