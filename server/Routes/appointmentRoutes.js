import express from 'express';
import { addTreatedDog, bookAppointment } from '../Controller/appointcontroller.js'; // Ensure this path is correct
import { verifyToken } from '../middleware/authMiddleware.js'; // Assuming you have auth middleware

const router = express.Router();

// POST /api/appointments/book - Book an appointment
router.post('/book',  bookAppointment);


router.post('/addTreatedDog', addTreatedDog);

export default router;