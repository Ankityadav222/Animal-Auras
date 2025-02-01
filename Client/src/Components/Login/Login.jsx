import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/Authcontext'; // Assuming AuthContext provides login function

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        username,
        password,
      });

      const userDetails = response.data.details;
      const token = response.data.token;

      // Save user details and token in local storage
      localStorage.setItem('user', JSON.stringify(userDetails));
      localStorage.setItem('token', token);

      // Update user context
      login(userDetails);

      // Redirect to homepage after 3 seconds
      setTimeout(() => {
        navigate('/'); // Change this to the homepage route
      }, 3000); // 3000 milliseconds = 3 seconds

      // Check if the username entered is an email (indicating a doctor)
      if (username.includes('@')) {
        // Redirect the doctor to the doctor dashboard
        navigate('/doctor-dashboard');
      } else {
        // Optionally, redirect to user dashboard immediately
        // navigate('/user-dashboard');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username or Email:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username or email"
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
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
