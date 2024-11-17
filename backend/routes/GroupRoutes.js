const express = require('express');
const router = express.Router();
const Group = require('../models/Group'); // Import the Group model with correct casing

router.post('/', async (req, res) => {
    try {
      console.log('Request body:', req.body); // Log the incoming request
      const { groupName, groupCode, status, groupMembers, groupType } = req.body;
  
      // Validate required fields
      if (!groupName || !groupCode || !groupType) {
        return res.status(400).json({ message: 'Group Name, Group Code, and Group Type are required.' });
      }
  
      // Ensure `status` is interpreted as a boolean
      const groupStatus = status === true || status === 'true'; // Convert to boolean if it's a string
  
      // Create and save group
      const newGroup = new Group({
        groupName,
        groupCode,
        status: groupStatus, // Explicitly use the correct boolean value
        groupMembers: groupMembers || [],
        groupType,
      });
  
      const savedGroup = await newGroup.save();
      res.status(201).json(savedGroup);
    } catch (error) {
      console.error('Error creating group:', error); // Log any errors
      res.status(500).json({ message: error.message });
    }
  });
  
  

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a group by ID
router.put('/:id', async (req, res) => {
  try {
    const { groupName, groupCode, status, groupMembers, groupType } = req.body;

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { groupName, groupCode, status, groupMembers, groupType },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a group by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.id);
    if (!deletedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
