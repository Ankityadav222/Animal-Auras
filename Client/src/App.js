import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
//import { AuthProvider } from './Context/Authcontext';
import Navbar from './Components/NavBar/Navbar';
import Home from './Components/Home/Home';
import Footer from './Components/Footer/Footer';
import Services from './Components/Services/Services';
import Contact from './Components/Contact/Contact';
import Pets from './Components/Pets/Pets';
import AdoptForm from './Components/AdoptForm/AdoptForm';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import AdminLogin from './Components/AdminPanel/AdminLogin';
import DoctorList from './Components/Doctors/Doctor'; // Updated import
import Appointment from './Components/Appointment/Appointment';
import './App.css';
import DoctorLogin from './Components/Login/Login';
import DoctorDashboard from './Components/Doctordashboard/Doctordashboard';
import { AuthProvider, useAuth } from './Context/Authcontext';
import Chatbot from './Components/Chatbot/Chatbot';


const Layout = ({ children }) => (
  <>
    <Navbar title="Animal Auras" />
    {children}
    <Footer title="Animal Auras" />
  </>
);

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home description="Ensure you are fully prepared to provide proper care and attention to your pet before welcoming them into your home." /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/pets" element={<Layout><Pets /></Layout>} />
          <Route path="/adopt-form" element={<Layout><AdoptForm /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/doctors" element={<Layout><DoctorList /></Layout>} />
          <Route path="/appointments" element={<ProtectedRoute element={<Layout><Appointment /></Layout>} />} />
          <Route path="/doctor-login" element={<Layout><DoctorLogin /></Layout>} /> {/* Unique route for Doctor Login */}
          <Route path="/doctor-dashboard" element={<ProtectedRoute element={<Layout><DoctorDashboard /></Layout>} />} /> {/* Protected route for DoctorDashboard */}
          <Route path="*" element={<Layout><div>404 Not Found</div></Layout>} /> {/* Handle unknown routes */}
          <Route path="/Chatbot" element={<Layout><Chatbot /></Layout>} />
          
    
    
          
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;