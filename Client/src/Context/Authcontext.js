import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check for user in localStorage when initializing state
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Function to handle login and update user state
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Save user data in localStorage
  };

  // Function to handle logout and clear user state
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear user data from localStorage
  };

  // Optional: You can use an effect to log out the user when the token expires
  useEffect(() => {
    const token = localStorage.getItem('token');
    // Here you can add logic to handle token expiration
    // For example, you could set an interval to check if the token is still valid
    // and log out the user if it's expired.
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 