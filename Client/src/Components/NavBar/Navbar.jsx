import './navbar.css';
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/Authcontext"; 
import logo from "./images/logo.png";

const Navbar = (props) => {
  const { user, logout } = useAuth() || {};
  
  // Log user to check its structure
  console.log("User:", user);

  // Check if the user is NOT a doctor based on the email domain (non-gmail users)
  const isDoctor = !user?.email?.includes('gmail.com');

  return (
    <div className="navbar-container">
      <div>
        <Link className="logo-container" to="/">
          <img className="navbar-logo" src={logo} alt="PawFinds Logo" />
          <p>{props.title}</p>
        </Link>
      </div>
      <div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/pets">Pets</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/doctors">Doctors</Link></li>

          {/* Show Dashboard link only if the user is NOT a doctor (non-gmail users) */}
          {isDoctor && <li><Link to="/doctor-dashboard">Dashboard</Link></li>}
        </ul>
      </div>
      <div className="navbar-user">
        {user ? (
          <>
            <p>Welcome, {user.username}</p>
            <button onClick={logout} className="Navbar-button">Logout</button>
          </>
        ) : (
          <Link to="/login">
            <button className="Navbar-button">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
