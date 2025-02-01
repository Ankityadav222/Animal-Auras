import React, { useState } from 'react';
import axios from 'axios';
import './flight.css'; // Ensure you have the CSS included

const FlightStatistics = () => {
  const [flightData, setFlightData] = useState(null);
  const [flightNumber, setFlightNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFlightStatistics = async (flightNumber) => {
    setLoading(true);
    setError(null);
    const url = `https://www.booking.com/index.en-gb.html?label=gen173nr-1FCAEoggI46AdIM1gEaGyIAQGYAQm4ARfIAQzYAQHoAQH4AQyIAgGoAgO4Ao6Z8rYGwAIB0gIkOWFmNWIyNzQtYmNmOS00MjUxLWFjNmMtN2IyNTQ1N2JhOGVm2AIG4AIB&aid=304142&selected_currency=INR&sid=b9fee4b2478815807d697da17c2f16a1`;
    try {
      const response = await axios.get(url, {
        headers: {
          'x-rapidapi-host': 'flightera-flight-data.p.rapidapi.com',
          'x-rapidapi-key': '2c6b1a9957msh2bf9caa9edafa0dp1180c8jsnc902f4623447'
        }
      });
      setFlightData(response.data);
    } catch (error) {
      setError('Error fetching flight data. Please check the flight number.');
      setFlightData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (flightNumber.trim()) {
      getFlightStatistics(flightNumber);
    } else {
      setError('Please enter a valid flight number.');
    }
  };

  return (
    <div className="flight-container">
      <h2>Flight Statistics</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Flight Number"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
        />
        <button type="submit">Get Flight Statistics</button>
      </form>

      {loading && <p>Loading flight statistics...</p>}

      {error && <p className="error">{error}</p>}

      {flightData && (
        <div className="flight-card">
          <p><span className="flight-key">Flight ID:</span> {flightData.id}</p>
          <p><span className="flight-key">Airline:</span> {flightData.airline}</p>
          <p><span className="flight-key">Departure:</span> {flightData.departure}</p>
          <p><span className="flight-key">Arrival:</span> {flightData.arrival}</p>
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
};

export default FlightStatistics;
