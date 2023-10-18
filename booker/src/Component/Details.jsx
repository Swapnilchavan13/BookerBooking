import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Details = () => {
const navigate = useNavigate()
  const [savedData, setSavedData] = useState(null);

  useEffect(() => {
    const savedDataString = localStorage.getItem('data');
    if (savedDataString) {
      const parsedData = JSON.parse(savedDataString);
      console.log(parsedData);
      setSavedData(parsedData);
    } else {
      console.error('Data not found');
    }
  }, []); // Use an empty dependency array to run this effect only once

  const handleConfirmClick = () => {
    // Send a POST request to your API with the savedData
    if (savedData) {
      fetch('http://localhost:3005/bookingdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(savedData),
      })
        .then((response) => response.json())
        .then((data) => {
            alert('Data stored successfully:', data)
            navigate('/home')
        //   console.log('Data stored successfully:', data);
        })
        .catch((error) => {
          alert('Error storing data:', error);
        });
    }
  };

  return (
    <div>
      <h1>Details</h1>
      {savedData && (
        <div>
          <h2>Theater Name: {savedData.tname}</h2>
          <p>Movie Name: {savedData.mname}</p>
          <p>Show Date: {savedData.sdate}</p>
          <p>Show Time: {savedData.showtime}</p>
          <p>Seats: {savedData.seats.join(', ')}</p>
          <button onClick={handleConfirmClick}>Confirm</button>
        </div>
      )}
    </div>
  );
};
