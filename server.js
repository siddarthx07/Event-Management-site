const express = require('express');
const app = express();
const multer = require('multer');
const Event = require('./models/event');
const cors = require('cors');
const { Op } = require('sequelize');  // Sequelize operators
const authMiddleware = require('./middleware/auth');  // Import the middleware
const authRoutes = require('./routes/auth'); // Import auth routes (register, login)
const sequelize = require('./config/database');
const User = require('./models/user');  // Import models
const { adminMiddleware, organizerMiddleware } = require('./middleware/roleMiddleware'); // Import role middleware
const userRoutes = require('./routes/user');  // Assuming your user route is in 'routes/user.js'
// Use CORS to avoid cross-origin issues
app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(userRoutes);
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Sync the database
sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
});

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads/'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);  // Unique filename
    }
  });
  
  const upload = multer({ storage: storage });

// Public Route: Fetch all events (publicly accessible)
app.get('/api/events', async (req, res) => {
    try {
        const { name, startDate, endDate } = req.query;
        let options = { where: {} }; // Base options

        // Filter by name if provided
        if (name) {
            options.where.name = { [Op.like]: `%${name}%` };
        }

        // Filter by date range if provided
        if (startDate && endDate) {
            options.where.date = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const events = await Event.findAll(options); // Fetch all events with the applied filters
        res.status(200).json(events);
    } catch (error) {
        console.error('Error while fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Authenticated Route: Fetch user-specific events
app.get('/api/events/myevents', authMiddleware, async (req, res) => {
    try {
        const { name, startDate, endDate } = req.query;
        const options = {
            where: {
                userId: req.user.id // Always filter by the logged-in user's ID
            }
        };

        // Filter by name if provided
        if (name) {
            options.where.name = { [Op.like]: `%${name}%` };
        }

        // Filter by date range if provided
        if (startDate && endDate) {
            options.where.date = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        // Fetch events with applied filters
        const events = await Event.findAll(options);
        res.status(200).json(events);
    } catch (error) {
        console.error('Error while fetching user events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Authenticated Route: Fetch event by ID
app.get('/api/events/:id', authMiddleware, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Ensure the logged-in user is the owner of the event or an admin
        if (event.userId !== req.user.id && req.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});
// Public Route: Fetch event by ID without authentication
app.get('/api/public/events/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});


// Protected Route: Create event (requires authentication and role: organizer or admin)
app.post('/api/events', authMiddleware, organizerMiddleware,upload.single('image'), async (req, res) => {
    const { name, description, date } = req.body;

    try {
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        const newEvent = await Event.create({
            name,
            description,
            date,
            image: imagePath,
            userId: req.user.id  // Use the authenticated user's ID
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(400).json({ error: 'Failed to create event' });
    }
});

// Protected Route: Update event by ID (requires authentication and role: organizer or admin)
app.put('/api/events/:id', authMiddleware, organizerMiddleware, async (req, res) => {
    const { name, description, date } = req.body;

    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Allow update if the user is either the event creator or an Admin
        if (event.userId !== req.user.id && req.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await event.update({ name, description, date });
        res.status(200).json(event);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Protected Route: Delete event by ID (requires authentication and admin or organizer role)
app.delete('/api/events/:id', authMiddleware, organizerMiddleware, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Allow deletion if the user is either the event creator (organizer) or an Admin
        if (req.role === 'admin' || (req.role === 'organizer' && event.userId === req.user.id)) {
            await event.destroy();
            return res.status(200).json({ message: 'Event deleted successfully' });
        }

        return res.status(403).json({ error: 'You are not authorized to delete this event' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
