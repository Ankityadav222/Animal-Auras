import Appointment from '../models/Appointment.js';

export const bookAppointment = async (req, res) => {
    const { userId, doctorId, appointmentTime, reason } = req.body;

    try {
        // Check if the appointment slot is already taken
        const existingAppointment = await Appointment.findOne({ doctorId, appointmentTime });
        if (existingAppointment) {
            return res.status(400).json({ message: "This time slot is already booked!" });
        }

        // Create new appointment
        const newAppointment = new Appointment({
            userId,
            doctorId,
            appointmentTime,
            reason, // Include the reason when saving the appointment
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
    
};


// Add treated dog details to doctor's profile
export const addTreatedDog = async (req, res, next) => {
    try {
      const { doctorId, dogName, treatmentDate, notes } = req.body;
  
      // Find doctor by ID and update the treatedDogs field
      const doctor = await User.findById(doctorId);
  
      if (doctor && doctor.role === 'doctor') {
        doctor.treatedDogs.push({ dogName, treatmentDate, notes });
        await doctor.save();
        res.status(200).json({ message: 'Dog treatment recorded successfully' });
      } else {
        next(createError(404, "Doctor not found or not authorized!"));
      }
    } catch (err) {
      next(err);
    }
  };