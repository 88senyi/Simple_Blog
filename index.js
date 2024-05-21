// Welcome to HealthMonitor!
// HealthMonitor is a comprehensive health tracking and management system designed to help individuals monitor and improve their overall well-being.
// Whether you're tracking fitness goals, managing chronic conditions, or simply aiming to live a healthier lifestyle,
// HealthMonitor provides the tools and insights you need to take control of your health journey.

// Sample code to demonstrate basic functionality of HealthMonitor

// Import necessary dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Define the Express application
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/healthmonitor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define MongoDB schema and model for user data
const userSchema = new mongoose.Schema({
  username: String,
  age: Number,
  height: Number,
  weight: Number,
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
    },
  ],
});

const activitySchema = new mongoose.Schema({
  type: String,
  duration: Number,
  caloriesBurned: Number,
});

const User = mongoose.model('User', userSchema);
const Activity = mongoose.model('Activity', activitySchema);

// Define API endpoints

// Endpoint to create a new user
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to get user by ID
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('activities');
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: 'User not found' });
  }
});

// Endpoint to add activity for a user
app.post('/api/users/:userId/activities', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const newActivity = new Activity(req.body);
    await newActivity.save();
    user.activities.push(newActivity);
    await user.save();
    res.status(201).json(newActivity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
