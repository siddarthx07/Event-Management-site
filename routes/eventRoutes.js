// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Create a new event
router.post('/', async (req, res) => {
  try {
    const { name, description, date } = req.body;
    const newEvent = await Event.create({ name, description, date });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the router
module.exports = router;
