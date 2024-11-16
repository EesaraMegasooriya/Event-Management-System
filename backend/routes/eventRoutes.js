const express = require('express');
const router = express.Router();
const Event = require('../models/Event'); // Import the Event model

// Create a new event
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      dateTime,
      venue,
      eventType,
      isPublic,
      status,
      inviteType,
      invitees,
    } = req.body;

    // Validate required fields
    if (!title || !dateTime || !eventType || !inviteType) {
      return res.status(400).json({ message: 'Title, Date/Time, Event Type, and Invite Type are required.' });
    }

    // Create and save the event
    const newEvent = new Event({
      title,
      description,
      dateTime,
      venue,
      eventType,
      isPublic,
      status,
      inviteType,
      invitees,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a specific event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update an event by ID
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      dateTime,
      venue,
      eventType,
      isPublic,
      status,
      inviteType,
      invitees,
    } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, dateTime, venue, eventType, isPublic, status, inviteType, invitees },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete an event by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.status(200).json({ message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
