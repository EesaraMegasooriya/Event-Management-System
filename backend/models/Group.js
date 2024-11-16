const mongoose = require('mongoose');

// Define the schema for group members
const MemberSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
});

// Define the schema for groups
const GroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  groupCode: { type: String, required: true, unique: true },
  status: { type: Boolean }, // Default to Active
  groupMembers: { type: [MemberSchema], default: [] },
  groupType: { type: String, enum: ['Corporate', 'Private', 'Public'], required: true },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Group', GroupSchema);
