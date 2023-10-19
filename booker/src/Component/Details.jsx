import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/details.css'

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
          alert("Tickets Are Booked !!!")
            navigate('/home')
        })
        .catch((error) => {
          alert('Error storing data:', error);
        });
    }
  };

  return (
    <div className="container">
      <h1>Details</h1>
      {savedData && (
        <div>
          <h2>Theater Name: {savedData.tname}</h2>
          <h4>Movie Name: {savedData.mname}</h4>
          <h4>Show Date: {savedData.sdate}</h4>
          <h4>Show Time: {savedData.showtime}</h4>
          <h4>Seats: {savedData.seats.join(', ')}</h4>
          <img width="300px" height="350px" src="qrcode.jpeg" alt="" />
          <br />
          <button onClick={handleConfirmClick}>Confirm And Pay</button>
        </div>
      )}
    </div>
  );
};
