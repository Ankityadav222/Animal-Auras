import './register.css'; // Importing the CSS file
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user'); // State for user role
  const [specialty, setSpecialty] = useState(''); // State for doctor's specialty
  const [licenseNumber, setLicenseNumber] = useState(''); // State for license number
  const [location, setLocation] = useState(''); // State for location
  const [contact, setContact] = useState(''); // State for contact number
  const [reason, setReason] = useState(''); // State for reason
  const [specialization, setSpecialization] = useState(''); // State for specialization
  const [availabilityStartTime, setAvailabilityStartTime] = useState(''); // State for start time
  const [availabilityEndTime, setAvailabilityEndTime] = useState(''); // State for end time
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      await axios.post('http://localhost:4000/api/auth/register', {
        username,
        password,
        email,
        role, // Include role in the request
        specialty, // Include specialty if doctor
        specialization, // Include specialization if doctor
        licenseNumber, // Include license number if doctor
        location, // Include location if doctor
        contact, // Include contact number if doctor
        reason, // Include reason for consultation if doctor
        availability: {
          startTime: availabilityStartTime, // Include availability start time
          endTime: availabilityEndTime, // Include availability end time
        },
      });
      navigate('/login'); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select 
            id="role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              // Reset doctor's specific fields if role changes
              if (e.target.value !== 'doctor') {
                setSpecialty('');
                setSpecialization(''); // Reset specialization if role changes
                setLicenseNumber('');
                setLocation('');
                setContact('');
                setReason('');
                setAvailabilityStartTime('');
                setAvailabilityEndTime('');
              }
            }}
            required
          >
            <option value="user">User</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        {/* Conditional fields for doctors */}
        {role === 'doctor' && (
          <>
            <div>
              <label htmlFor="specialty">Specialty:</label>
              <input
                type="text"
                id="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="specialization">Specialization:</label>
              <input
                type="text"
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="contact">Contact:</label>
              <input
                type="text"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="reason">Reason for Consultation:</label>
              <input
                type="text"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="availabilityStartTime">Availability Start Time:</label>
              <input
                type="time"
                id="availabilityStartTime"
                value={availabilityStartTime}
                onChange={(e) => setAvailabilityStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="availabilityEndTime">Availability End Time:</label>
              <input
                type="time"
                id="availabilityEndTime"
                value={availabilityEndTime}
                onChange={(e) => setAvailabilityEndTime(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p className="error">{error}</p>} {/* Error message styling */}
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Register;
