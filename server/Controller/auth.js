import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import Doctor from '../models/Doctor.js'; // Adjust the path to your Doctor model


// Registration for both users and doctors
export const register = async (req, res, next) => {
  try {
    const { username, email, password, role, location, specialty, contact, specialization, reason, availability, image, petsServed } = req.body;

    // Validate role
    if (!['doctor', 'user'].includes(role)) {
      return next(createError(400, 'Invalid role! Please choose either "doctor" or "user".'));
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if (role === 'doctor') {
      // Validate required fields for doctors
      if (!location || !specialty || !contact || !specialization || !reason || !availability?.startTime || !availability?.endTime) {
        return next(createError(400, 'All doctor fields (location, specialty, contact, etc.) are required!'));
      }

      // Register as a doctor
      const newDoctor = new Doctor({
        username,
        email,
        password: hash,
        location,
        specialty,
        contact,
        specialization,
        reason,
        availability,
        image, // Optional
        petsServed // Optional
      });

      await newDoctor.save();
      return res.status(201).json({ message: 'Doctor registered successfully' });

    } else if (role === 'user') {
      // Register as a regular user
      const newUser = new User({
        username,
        email,
        password: hash,
        role: 'user' // Explicitly set role as 'user'
      });

      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully' });
    }
  } catch (err) {
    // Handle duplicate username or email
    if (err.code === 11000) {
      return next(createError(400, 'Username or email already exists!'));
    }
    next(err); // Pass other errors to the error handler
  }
};

// Login function for both doctors and users
// Login function for both doctors and users
export const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Determine if the user is a doctor (by email) or a regular user (by username)
    let user;
    if (username.includes('@')) {                                    
      // If the username includes '@', it's an email, check for doctor by email
      user = await Doctor.findOne({ email: { $regex: new RegExp(`^${username}$`, "i") } });
    } else {
      // Otherwise, it's a regular username, check for a regular user by username
      user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } });
    }

    // If no user or doctor is found, return a 404 error
    if (!user) return next(createError(404, "User not found!"));

    // Compare the provided password with the hashed password stored in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return next(createError(400, "Wrong password or username!"));

    // Generate JWT token with the user's ID and role (doctor or regular user)
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Exclude the password from the user object in the response
    const { password: _, ...otherDetails } = user._doc;

    // Send token and user details back in the response
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set secure flag only in production
      })
      .status(200)
      .json({ details: { ...otherDetails }, token }); // Include the token in the response

  } catch (err) {
    next(err); // Pass any caught error to error-handling middleware
  }
};
