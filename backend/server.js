const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Enable Mongoose debugging for MongoDB queries
mongoose.set('debug', true);

// Routes
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));




// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
