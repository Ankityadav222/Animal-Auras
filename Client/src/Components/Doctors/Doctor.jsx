import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './doctor.css';
import logo from "../../img/left img.png";
import reviewImage1 from "../../img/hbg1.png";
import reviewImage2 from "../../img/hbg1.png";
import reviewImage3 from "../../img/hbg1.png";
import img from "../../img/doctor.avif";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', problem: '' });
  const [currentReview, setCurrentReview] = useState(0); 
  const navigate = useNavigate();

  const reviews = [
    { author: 'John Doe', text: 'Excellent care and friendly staff!', image: reviewImage1 },
    { author: 'Jane Smith', text: 'Best vet clinic I’ve been to, very professional.', image: reviewImage2 },
    { author: 'Emily White', text: 'Great experience! My dog was treated very well.', image: reviewImage3 },
    { author: 'Michael Brown', text: 'Fantastic service, highly recommend!', image: reviewImage1 },
    { author: 'Sarah Johnson', text: 'The vets are very compassionate and knowledgeable.', image: reviewImage2 },
    { author: 'Chris Lee', text: 'Super clean clinic and fast service. Highly appreciated.', image: reviewImage3 },
    { author: 'David Wilson', text: 'Affordable pricing and the staff is very caring.', image: reviewImage1 },
  ];

  useEffect(() => {
    const scrollContainer = document.querySelector('.scroll-container');
    const autoScroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += 2; 
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
    };

    const scrollInterval = setInterval(autoScroll, 10); 
    return () => clearInterval(scrollInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prevReview) => (prevReview + 1) % reviews.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [reviews.length]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/doctors');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData); 

    navigate('/appointments', { state: formData });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section id="doctors-near-you">  

      <div className="container" style={{marginBottom:"10px",}}>
      <div className='Another'>
        <h2>Meet Our Expert and Compassionate Veterinarians - Waiting for Your Furry Friends!</h2>
        <div className='doc-pics'>
          <div className="scroll-container">
            <img src={img} alt="Doctor 1" className="doc-pic" />
          </div>
        </div>
      </div>
        <div className='rightcontainer'>
          <h2> </h2>
          <h2> </h2>
        </div>
      </div>

      <div className='offer'>
        <div className='left'>
          <img src={logo} alt="Best Vet Clinics in Mumbai" className="header-image" />
          <h4>25+ Modern & Hygienic Clinics</h4>
          <br />
          <img src={logo} alt="Best Vet Clinics in Mumbai" className="header-image" />
          <h4>24/7 Emergency Services</h4>
          <br />
          <img src={logo} alt="Best Vet Clinics in Mumbai" className="header-image" />
          <h4>Compassionate Staff</h4>
          <br />
          <img src={logo} alt="Best Vet Clinics in Mumbai" className="header-image" />
          <h4>Experienced Veterinarians</h4>
        </div>
        
        <div className='right'>
          <h4 style={{marginLeft: "164px"}}>Book Your Appointment</h4>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </label>
            <br />
            <label>
              Phone Number:
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange} 
                required 
              />
            </label>
            <br />
            <label>
              Dog Problem:
              <textarea 
                name="problem" 
                value={formData.problem} 
                onChange={handleInputChange} 
                required 
              />
            </label>
            <br />
            <button type="submit">Book Appointment</button>
          </form>
        </div>
      </div>

      <div className='review' style={{maxWidth:"85%", margin:"auto", padding:"20px"}} >
        <div className='leftreview'>
          <h1>Google Review</h1>
        </div>
        <div className='rightreview'>
          <p>72K+ Rating</p>
          <div className='review-item'>
            <img src={reviews[currentReview].image} alt={`Review by ${reviews[currentReview].author}`} className="review-image" />
            <p>"{reviews[currentReview].text}"</p>
            <p><strong>- {reviews[currentReview].author}</strong></p>
          </div>
        </div>
      </div>

      
      <h2>Top-quality & expert veterinary services near you</h2>
      <div className='card'>
        {doctors.length === 0 ? (
          <div>No doctors available</div>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor._id} className="doctor-card">
              <img 
                src={doctor.image || 'https://via.placeholder.com/150'} 
                alt={doctor.name} 
                className="doctor-image" 
              />
              <h3>{doctor.name}</h3>
              <p><strong>Specialty:</strong> {doctor.specialty}</p>
              <p><strong>Contact:</strong> {doctor.contact}</p>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>Reason:</strong> {doctor.reason}</p>
              <p><strong>Pets Served:</strong> {doctor.petsServed.join(', ')}</p>
              <p><strong>Status:</strong> {doctor.isAtClinic ? 'In Clinic' : 'Not in Clinic'}</p> {/* Add clinic status */}
              <Link to={`/appointments?doctor=${doctor._id}`}>
                <button>Contact</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default DoctorList;
