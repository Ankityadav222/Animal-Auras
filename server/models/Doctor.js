import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Renamed from name to username
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true }, // Current location (clinic or other)
  isAtClinic: { type: Boolean, default: true }, // Whether the doctor is at their own clinic
  specialty: { type: String, required: true },
  contact: { type: String, required: true },
  specialization: { type: String, required: true },
  reason: { type: String, required: true },
  availability: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  image: { type: String }, // Field for the doctor's image
  petsServed: [{ type: String }], // Field for pets the doctor serves
  petsCured: [{ // Field for pets cured by the doctor
    petName: { type: String, required: true },
    condition: { type: String, required: true },
    cureDate: { type: Date, required: true },
    notes: { type: String }
  }]
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;
