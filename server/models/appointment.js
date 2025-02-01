import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a compound index to ensure unique appointment times per doctor
appointmentSchema.index({ doctorId: 1, appointmentTime: 1 }, { unique: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);



export default Appointment;
