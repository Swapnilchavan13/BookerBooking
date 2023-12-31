import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/details.css';

export const Details = () => {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(true);
  const [isUpiValid, setIsUpiValid] = useState(true);


  const [formData, setFormData] = useState({
    customerMobile: '',
    customerName: '',
    gender: 'Male',
    paymentMethod: 'UPI',
    upiRef: '',
  });
  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const savedDataString = localStorage.getItem('data');
    if (savedDataString) {
      const parsedData = JSON.parse(savedDataString);
      setSavedData(parsedData);
    } else {
      console.error('Data not found');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'customerMobile') {
      setIsMobileValid(value.length === 10);
    }

    if (name === 'upiRef') {
      setIsUpiValid(value.length === 12);
    }
  
  };
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

    if (!isMobileValid) {
      var message = 'Invalid mobile number. Please enter at least 10 digits.';
      openPopup(message);
      return;
    }

    if (!isUpiValid) {
      var message = 'Invalid UPI reference number. Please enter 12 digits.';
      openPopup(message);
      return;
    }

    if (!formData.customerMobile || !formData.customerName) {
      var message = 'Please fill in both customer name and mobile number.';
      openPopup(message);
      return;
    }

    if (formData.paymentMethod === "UPI" && !formData.upiRef) {
      var message = 'Please fill the Upi ref Number';
      openPopup(message);
      return;
    }

    if (savedData) {
      // Combine form data with saved data
      const bookingData = {
        ...savedData,
        ...formData,
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
            
            setIsModalOpen(true);
          } else {
            var message = 'Sorry Seats are already booked'
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


  const handlePrintClick = () => {
    window.print();

    setTimeout(() => {
      navigate('/home');
    }, 2000);
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
                <td>{savedData.tname}</td>
              </tr>
              <tr>
                <th>Movie Name</th>
                <td>{savedData.mname}</td>
              </tr>
              <tr>
                <th>Show Date</th>
                <td>{savedData.sdate}</td>
              </tr>
              <tr>
                <th>Show Time</th>
                <td>{savedData.showtime}</td>
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
          <div>
            <br />
            <div>
              <label className='lab' htmlFor="customermobile"> Customer's Mobile</label>
              <input
  type="number"
  name="customerMobile"
  id="customerMobile"
  placeholder="Customer's Mobile"
  value={formData.customerMobile}
  onChange={handleInputChange}
  className={isMobileValid ? '' : 'invalid'}
/>

            </div>

            <div>
              <label className='lab' htmlFor="customername"> Customer's Name</label>
              <input
                name="customerName"
                type="text"
                id="customerName"
                placeholder="Customer's Name"
                value={formData.customerName}
                onChange={handleInputChange}
              />
            </div>
<br />
            <div className='genderdiv'>
  <label className='lab'>Gender</label>
  <select
    name="gender"
    value={formData.gender}
    onChange={handleInputChange}
  >
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>
</div>
<br />
<div className='genderdiv'>
  <label className='lab'>Payment Method</label>
  <select
    name="paymentMethod"
    value={formData.paymentMethod}
    onChange={handleInputChange}
  >
    <option value="UPI">UPI</option>
    <option value="Cash">Cash</option>
    <option value="Comp">Complimentary</option>
  </select>
  </div>
  </div>

          <br />
          <div className={formData.paymentMethod === 'Cash' || formData.paymentMethod === 'Comp'? 'scanner hidden' : 'scanner' }>
            <h3>Scan & Pay!</h3>
            <img width="300px" height="450px" src="qrcode.jpeg" alt="" />
            <br />
            <br />
            <div>
              <label className='lab' htmlFor="customername"> UPI Ref. No</label>
      
<input
  type="number"
  name="upiRef"
  id="upiRef"
  placeholder="UPI Ref. No"
  value={formData.upiRef}
  onChange={handleInputChange}
  className={isUpiValid ? '' : 'invalid'}
/>

            </div>
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
            <h2>Ticket Booking Details</h2>
            <h4>Theater Name: {savedData.tname}</h4>
            <h4>Movie Name: {savedData.mname}</h4>
            <h4>Show Date: {savedData.sdate}</h4>
            <h4>Show Time: {savedData.showtime}</h4>
            <h4>Seats: {savedData.seats.join(', ')}</h4>
            <h4>Total: Rs.{savedData.seats.length * 100} /-</h4>

            <button onClick={handlePrintClick}>Print Ticket</button> <br />
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
