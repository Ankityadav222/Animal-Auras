import express from 'express';
import { getAllDoctors, getAppointmentsByDoctor, addDoctor, getLoggedInDoctor, getDoctorProfile, addCuredPet } from '../Controller/doctorcontroller.js'; // Ensure the path is correct
import upload from './upload.js';
import authenticateUser, { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/doctors - Get all doctors
router.get('/', getAllDoctors);

// GET /api/appointments/:doctorId - Get appointments by doctor
router.get('/:doctorId/appointments', getAppointmentsByDoctor);

// Route for admin to add a new doctor with image upload
router.post('/add', upload.single('image'), addDoctor);

// POST /api/doctors - Add a new doctor
router.post('/', addDoctor);

// Route to get doctor profile
router.get('/profile', verifyToken, getDoctorProfile);


// POST route to add a cured pet
router.post('/add-cured-pet',authenticateUser, addCuredPet);


export default router;
