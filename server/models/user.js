import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'doctor'],
      required: true,
    },
    treatedDogs: [
      {
        dogName: String,
        treatmentDate: Date,
        notes: String,
      }
    ], // This field will be used by doctors to track dogs treated
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
