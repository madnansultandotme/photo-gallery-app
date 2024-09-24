const express = require('express');
const multer = require('multer');
const path = require('path');
const Photo = require('../models/Photo');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const fs = require('fs');

// Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage });
// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../uploads');
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage });
  // Upload photo
router.post('/upload', authMiddleware, upload.array('photos', 10), async (req, res) => {
    console.log('Files:', req.files); // Log received files
    try {
      const userId = req.user.id;
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      const filenames = req.files.map(file => file.filename);
      console.log('Filenames:', filenames); // Log filenames to be saved in the database
      await Promise.all(filenames.map(filename => Photo.upload(userId, filename)));
      res.status(201).json({ message: 'Photos uploaded successfully' });
    } catch (error) {
      console.error('Error uploading photos:', error); // Log error for debugging
      res.status(500).json({ error: 'Server error' });
    }
  });

// Get photos for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const photos = await Photo.getByUserId(userId);
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete photo
// Delete photo
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const photoId = req.params.id;
      
      // Fetch the photo record from the database to get the filename
      const photo = await Photo.getById(photoId);
      if (!photo) {
        return res.status(404).json({ error: 'Photo not found' });
      }
  
      // Remove the file from the uploads directory
      const filePath = path.join(__dirname, '../uploads', photo.filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status(500).json({ error: 'Error deleting file' });
        }
        
        // Delete the record from the database
        Photo.deleteById(photoId)
          .then(() => res.json({ message: 'Photo deleted successfully' }))
          .catch(error => res.status(500).json({ error: 'Server error' }));
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;
