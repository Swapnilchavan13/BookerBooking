import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/details.css';

export const Details = () => {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    customerMobile: '',
    customerName: '',
    gender: 'Male',
    paymentMethod: 'UPI',
    upiRef: '',
  });
  // const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const savedDataString = localStorage.getItem('data');
    if (savedDataString) {
      const parsedData = JSON.parse(savedDataString);
      setSavedData(parsedData);
    } else {
      console.error('Data not found');
    }
  }, []);

 
  //Open the Popup
  function openPopup(message) {
    var popup = document.getElementById('customPopup');
    var popupMessage = document.getElementById('popupMessage');
    popup.style.display = 'block';
    popupMessage.textContent = message;
  }

  // Close the custom popup
  function closePopup() {
    var popup = document.getElementById('customPopup');
    popup.style.display = 'none';
    navigate('/details');
  }

  const handleConfirmClick = () => {
    if (savedData) {
      // Combine form data with saved data
      const bookingData = {
        ...savedData
      };

      fetch('http://62.72.59.146:3005/bookingdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'Data stored successfully.') {
            var message = 'Success: Tickets Booked successfully.';
            openPopup(message);

            console.log(bookingData)
            setIsModalOpen(true);
          } else {
             message = 'Sorry Seats are already booked'
            openPopup(message);
            navigate('/home');
          }
        })
        .catch((error) => {
          alert('Error storing data:', error);
        });
      console.log(bookingData)
    }
  };


  const handleCancel = () => {
    setIsModalOpen(false);
    navigate('/home');
  };

  return (
    <div className="container">
      <h1>Booking Details</h1>
      {savedData && (
        <div>
          {/* Display saved data here */}
          <div>
            {/* Display saved data here */}
            <table className="styled-table">
              <tr>
                <th>Theater Name</th>
                <td>{savedData.theatreName}</td>
              </tr>
              <tr>
                <th>Movie Name</th>
                <td>{savedData.movieName}</td>
              </tr>
              <tr>
                <th>Show Date</th>
                <td>{savedData.showDate}</td>
              </tr>
              <tr>
                <th>Show Time</th>
                <td>{savedData.showTime}</td>
              </tr>
              <tr>
                <th>Seats</th>
                <td>{savedData.seats.join(', ')}</td>
              </tr>
              <tr>
                <th>Total</th>
                <td>Rs.{savedData.seats.length * 100} /-</td>
              </tr>
            </table>
          </div>
         
          <br />

          <button className='bookigbtn' onClick={handleConfirmClick}>Confirm Booking</button>
          <button className='bookigbtn' style={{ marginLeft: '20px' }} onClick={handleCancel}>Cancel</button>

          <div id="customPopup" className="modal">
            <div className="modal-content">
              <span className="close" onClick={closePopup}>&times;</span>
              <p id="popupMessage"></p>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2 style={{color:'black'}}>Ticket Booking Details</h2>
            <h4 style={{color:'black'}}>Theater Name: {savedData.theatreName}</h4>
            <h4 style={{color:'black'}}>Movie Name: {savedData.movieName}</h4>
            <h4 style={{color:'black'}}>Show Date: {savedData.showDate}</h4>
            <h4 style={{color:'black'}}>Show Time: {savedData.showTime}</h4>
            <h4 style={{color:'black'}}>Seats: {savedData.seats.join(', ')}</h4>
            <h4 style={{color:'black'}}>Total: Rs.{savedData.seats.length * 100} /-</h4>

            <button onClick={handleCancel}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
};
