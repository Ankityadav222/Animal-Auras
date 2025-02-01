import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../Context/Authcontext'; // Import useAuth
import './Appointment.css'; // Import CSS for Appointment

const Appointment = () => {
  const { user } = useAuth(); // Get the user from context
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctor');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Combine date and time into a single Date object
      const appointmentTime = new Date(`${date}T${time}`);

      await axios.post('http://localhost:4000/api/appointments/book', {
        doctorId,
        appointmentTime, // Send the combined appointmentTime
        userId: user._id, // Use the logged-in user's ID
      });
      alert('Appointment booked successfully!');
      navigate('/'); // Redirect to home or another page after booking
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="appointment-container">
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Book Appointment</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Appointment;
