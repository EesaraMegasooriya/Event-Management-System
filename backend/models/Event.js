const mongoose = require('mongoose');

// Define the schema for invitees
const InviteeSchema = new mongoose.Schema({
  id: { type: String, required: true }, // ID of the invitee (user or group)
  name: { type: String, required: true }, // Name of the invitee (user or group)
});

// Define the schema for the event
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Event title
  description: { type: String }, // Event description
  dateTime: { type: Date, required: true }, // Date and time of the event
  venue: { type: String }, // Event venue
  eventType: { type: String, enum: ['Conference', 'Workshop', 'Seminar'], required: true }, // Type of the event
  isPublic: { type: Boolean, default: false }, // Whether the event is public
  status: { type: String, enum: ['Scheduled', 'On Going', 'Postpone', 'Cancel'], default: 'Scheduled' }, // Status of the event
  inviteType: { type: String, enum: ['group', 'individual'], required: true }, // Invite type
  invitees: { type: [InviteeSchema], default: [] }, // Array of invitee objects (id and name)
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

module.exports = mongoose.model('Event', EventSchema);
