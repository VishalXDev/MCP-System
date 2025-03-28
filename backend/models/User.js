const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ['MCP', 'Pickup Partner'], required: true },
    walletBalance: { type: Number, default: 0 }
});
module.exports = mongoose.model('User', userSchema);
