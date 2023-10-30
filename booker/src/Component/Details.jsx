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
  };

  const handleConfirmClick = () => {
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
            alert('Success: Tickets Booked successfully.');
            setIsModalOpen(true);
          } else {
            alert('Sorry Seats are already booked');
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
              <label htmlFor="customermobile"> Customer's Mobile</label>
              <input
                type="text"
                name="customerMobile"
                id="customerMobile"
                placeholder="Customer's Mobile"
                value={formData.customerMobile}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="customername"> Customer's Name</label>
              <input
                type="text"
                name="customerName"
                id="customerName"
                placeholder="Customer's Name"
                value={formData.customerName}
                onChange={handleInputChange}
              />
            </div>

            <div className='genderdiv'>
              {/* <label>Gender</label> */}
              <br />
              <label htmlFor="male">
              <input
                type="radio"
                name="gender"
                id="male"
                value="Male"
                checked={formData.gender === 'Male'} // Set as checked if 'Male'
                onChange={handleInputChange}
              />
              Male
              </label>

              <label htmlFor="female">
              <input
                type="radio"
                name="gender"
                id="female"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleInputChange}
              />
             Female
             </label>
            </div>

            <div>
              <br />
              <label htmlFor="upi">
              <input
                type="radio"
                name="paymentMethod"
                id="upi"
                value="UPI"
                checked={formData.paymentMethod === 'UPI'}
                onChange={handleInputChange}
              />
              UPI</label>

              <label htmlFor="cash">
              <input
                type="radio"
                id="cash"
                value="Cash"
                name="paymentMethod"
                checked={formData.paymentMethod === 'Cash'} 
                onChange={handleInputChange}
              />
              Cash</label>
            </div>
          </div>
          <br />
          <div className={formData.paymentMethod === 'Cash' ? 'scanner hidden' : 'scanner'}>
        <h3>Scan And Pay The Amount</h3>
        <img width="300px" height="450px" src="qrcode.jpeg" alt="" />
        <br />
        <div>
              <label htmlFor="customername"> UPI Ref. No</label>
              <input
                type="text"
                name="upiRef"
                id="upiRef"
                placeholder="UPI Ref. No"
                value={formData.upiRef}
                onChange={handleInputChange}
              />
        </div>
      </div>

          <br />
          <button onClick={handleConfirmClick}>Book Ticket</button>
          <button style={{marginLeft:'20px'}} onClick={handleCancel}>Cancel</button>

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
