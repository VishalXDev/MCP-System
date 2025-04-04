const Transaction = require("../models/Transaction");
const User = require("../models/user");

// Get all transactions for a user
exports.getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new transaction (credit/debit)
exports.addTransaction = async (req, res) => {
  try {
    const { userId, amount, type, description } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newBalance =
      type === "credit" ? user.wallet + amount : user.wallet - amount;
    if (newBalance < 0) return res.status(400).json({ error: "Insufficient balance" });

    user.wallet = newBalance;
    await user.save();

    const transaction = await Transaction.create({
      userId,
      amount,
      type,
      description,
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
