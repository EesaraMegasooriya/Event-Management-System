const mongoose = require('mongoose');

// Define the schema for users
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Admin', 'User', 'Moderator'], default: 'User' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('User', UserSchema);
