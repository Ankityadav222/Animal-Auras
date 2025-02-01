import Doctor from '../models/Doctor.js'; // Ensure the correct import
import Appointment from '../models/Appointment.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get appointments for a specific doctor
export const getAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const appointments = await Appointment.find({ doctorId });
    if (!appointments.length) {
      return res.status(404).json({ message: 'No appointments found for this doctor.' });
    }
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new doctor
// Add a new doctor
export const addDoctor = async (req, res) => {
  const { username, email, password, location, contact, specialty, specialization, reason, availability, petsServed } = req.body;
  const image = req.file ? req.file.path : ''; // Get the path of the uploaded image

  try {
    const newDoctor = new Doctor({
      username, // Use username instead of name
      email,
      password,
      location,
      contact,
      specialty,
      specialization,
      reason,
      availability,
      image, // Store the path to the image
      petsServed // Array of pets the doctor serves
    });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Doctor login
export const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if doctor exists
      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found' });
      }

      // Validate password
      const isPasswordCorrect = await bcrypt.compare(password, doctor.password);
      if (!isPasswordCorrect) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: doctor._id, role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token, doctor: { id: doctor._id, name: doctor.name, location: doctor.location, isAtClinic: doctor.isAtClinic } });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

export const getLoggedInDoctor = async (req, res) => {
  try {
      const doctorId = req.user.id;
      const doctor = await Doctor.findById(doctorId).select('-password'); // Exclude password from the response
      if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found' });
      }
      res.status(200).json(doctor);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

export const getDoctorProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // Use the decoded user ID from the token
    const role = req.user.role; // Determine the role from the token

    if (role == 'doctor') {
      return res.status(403).json({ message: 'Access denied. Only doctors can access this profile.' });
    }

    console.log('Decoded doctor ID:', userId); // Log the decoded doctor ID

    // Fetch doctor profile based on ID and role
    const doctor = await Doctor.findById(userId).select('-password'); // Exclude the password

    if (!doctor) {
      console.log('Doctor not found with ID:', userId); // Log if doctor is not found
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const addCuredPet = async (req, res) => {
  const { petName, condition, cureDate, notes } = req.body;

  try {
    const doctorId = req.user.id; // Using authentication middleware to get the logged-in doctor ID
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Add the cured pet to the doctor's petsCured array
    const curedPet = {
      petName,
      condition,
      cureDate,
      notes,
    };

    doctor.petsCured.push(curedPet);
    await doctor.save();

    res.status(201).json(curedPet);
  } catch (err) {
    res.status(500).json({ message: 'Error adding cured pet', error: err.message });
  }
};