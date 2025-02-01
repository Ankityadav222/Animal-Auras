import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Doctordashboard.css'; // Import CSS for styling

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [treatedDogs, setTreatedDogs] = useState([]);
  const [curedPets, setCuredPets] = useState([]); // State for cured pets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New state for the form
  const [petName, setPetName] = useState('');
  const [condition, setCondition] = useState('');
  const [cureDate, setCureDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/doctors/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctor(response.data);
        setTreatedDogs(response.data.petsServed || []);
        setCuredPets(response.data.petsCured || []);
      } catch (err) {
        setError('Error fetching doctor data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  const handleAddCuredPet = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const newPet = {
        petName,
        condition,
        cureDate,
        notes,
      };

      // POST request to add the new cured pet to the backend
      const response = await axios.post('http://localhost:4000/api/doctors/add-cured-pet', newPet, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the local state after successfully adding the pet
      setCuredPets([...curedPets, response.data]); // Assuming the backend returns the updated pet
      setPetName(''); // Clear the form fields
      setCondition('');
      setCureDate('');
      setNotes('');
    } catch (err) {
      setError('Error adding pet.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!doctor) return <p>No doctor data available.</p>;

  return (
    <div className="dashboard">
      <h1>Doctor Dashboard</h1>

      {/* Doctor Information Section */}
      <div className="doctor-info">
        <h2>Doctor Information</h2>
        <p><strong>Username:</strong> {doctor.username}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>Specialization:</strong> {doctor.specialization || 'N/A'}</p>
        <p><strong>Location:</strong> {doctor.location}</p>
        <p><strong>Availability:</strong> {doctor.availability?.startTime} - {doctor.availability?.endTime}</p>
        <p><strong>Contact:</strong> {doctor.contact}</p>
      </div>

      {/* Add New Cured Pet Section */}
      <div className="add-cured-pet">
        <h2>Add Cured Pet</h2>
        <form onSubmit={handleAddCuredPet}>
          <input
            type="text"
            placeholder="Pet Name"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="Cure Date"
            value={cureDate}
            onChange={(e) => setCureDate(e.target.value)}
            required
          />
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
          <button type="submit">Add Cured Pet</button>
        </form>
      </div>

      {/* Previously Cured Pets Section */}
      <div className="cured-pets">
        <h2>Pets Cured Previously</h2>
        {curedPets.length > 0 ? (
          <ul>
            {curedPets.map((pet, index) => (
              <li key={index}>
                <p><strong>Pet Name:</strong> {pet.petName}</p>
                <p><strong>Cure Date:</strong> {new Date(pet.cureDate).toLocaleDateString()}</p>
                <p><strong>Condition:</strong> {pet.condition}</p>
                <p><strong>Notes:</strong> {pet.notes}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pets cured previously.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
