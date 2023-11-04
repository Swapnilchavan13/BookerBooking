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
  };

  const handleConfirmClick = () => {

    if (!formData.customerMobile || !formData.customerName) {
      alert('Please fill in both customer name and mobile number.');
      return;
    }

    if (formData.paymentMethod === "UPI" && !formData.upiRef) {
      alert('Please fill the Upi ref Number')
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
              <label className='lab' htmlFor="customermobile"> Customer's Mobile</label>
              <input
                type="number"
                name="customerMobile"
                id="customerMobile"
                placeholder="Customer's Mobile"
                value={formData.customerMobile}
                onChange={handleInputChange}
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
  </select>
  </div>
  </div>

          <br />
          <div className={formData.paymentMethod === 'Cash' ? 'scanner hidden' : 'scanner'}>
            <h3>Scan & Pay!</h3>
            <img width="300px" height="450px" src="qrcode.jpeg" alt="" />
            <br />
            <br />
            <div>
              <label  className='lab' htmlFor="customername"> UPI Ref. No</label>
              <input
                type="number"
                name="upiRef"
                id="upiRef"
                placeholder="UPI Ref. No"
                value={formData.upiRef}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <br />
          
          <button className='bookigbtn' onClick={handleConfirmClick}>Confirm Booking</button>
          <button className='bookigbtn' style={{ marginLeft: '20px' }} onClick={handleCancel}>Cancel</button>

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
