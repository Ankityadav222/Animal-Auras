import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';

// Import routes
import petRouter from './Routes/PetRoute.js';
import AdoptFormRoute from './Routes/AdoptFormRoute.js';
import AdminRoute from './Routes/AdminRoute.js';
import authRoute from './Routes/auth.js';
import appointmentRoutes from './Routes/appointmentRoutes.js';
import doctorRoutes from './Routes/doctorRoutes.js'; // Import doctor routes

dotenv.config();

// For ES modules, these are necessary to get the directory name and work with static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// CORS Configuration
const corsOptions = {
    origin: '', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies and other credentials
};

// Middleware
app.use(cors(corsOptions)); // Use CORS middleware with options
app.use(cookieParser()); // To handle cookies for authentication
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/pets', petRouter); // Prefix routes for pets
app.use('/api/adoptform', AdoptFormRoute); // Prefix routes for adoption forms
app.use('/api/admin', AdminRoute); // Prefix routes for admin
app.use('/api/auth', authRoute); // Use auth routes under /api/auth
app.use('/api/appointments', appointmentRoutes); // Use appointment routes under /api/appointments
app.use('/api/doctors', doctorRoutes); // Use doctor routes under /api/doctors

// Handle 404 - Page Not Found
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    console.error(err); // Log the error
    res.status(status).json({ message });
});

// Connect to MongoDB using the environment variable
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to DB');
        
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Success:', err);
    });
