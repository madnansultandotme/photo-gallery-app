const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config(); // Ensure this is at the top of your server file

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the upload form
app.get('/', (req, res) => {
  res.render('upload');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Export the app module for Vercel
module.exports = app;
