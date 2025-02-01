import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { postPetRequest, approveRequest, deletePost, allPets } from '../Controller/PetController.js';

// For ES modules, these lines are needed to get the directory name and work with static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../images')); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes for fetching pets based on status
router.get('/requests', allPets);  // Handles Pending by default
router.get('/approvedPets', allPets);  // Use appropriate status in controller
router.get('/adoptedPets', allPets);  // Use appropriate status in controller

// Route for posting a new pet request with an image upload
router.post('/services', upload.single('picture'), postPetRequest);

// Route for approving a pet request by ID
router.put('/approving/:id', approveRequest);  // Correct usage of the controller function

// Route for deleting a pet by ID
router.delete('/:id', deletePost);  // Ensure pet ID is passed correctly


 

export default router;
 