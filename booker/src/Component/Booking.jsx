import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/booking.css';

const Seat = ({ seatNumber, isSelected, isBooked, onSelect }) => {
  const seatClassName = isSelected
    ? 'seat selected'
    : isBooked
    ? 'seat booked'
    : 'seat';

  const handleClick = () => {
    if (!isBooked) {
      onSelect(seatNumber);
    }
  };


  return (
    <div className={seatClassName} onClick={handleClick}>
      {seatNumber}
    </div>
  );
};

export const Booking = () => {
  const navigate = useNavigate();
  const seatPrice = 100;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  const seatsLayout = [
    ['A', 6],
    ['B', 7],
    ['C', 8],
  ];

  // Function to save selected seats in local storage
  const saveSelectedSeatsToLocalStorage = (seats) => {
    localStorage.setItem('selectedSeats', JSON.stringify(seats));
  };

  // Function to load selected seats from local storage
  const loadSelectedSeatsFromLocalStorage = () => {
    const storedSeats = localStorage.getItem('selectedSeats');
    if (storedSeats) {
      setSelectedSeats(JSON.parse(storedSeats));
    }
  };

  useEffect(() => {
    // Load selected seats from local storage when the component mounts
    loadSelectedSeatsFromLocalStorage();
  }, []);

  // Function to handle seat selection
  const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }

    // Save the updated selected seats to local storage
    saveSelectedSeatsToLocalStorage(selectedSeats);
  };
  
  const BookTicket = () => {
    if (selectedSeats.length > 0) {
      // Save the selected seats to local storage when the "Book Tickets" button is clicked
      saveSelectedSeatsToLocalStorage(selectedSeats);
      alert('Work In Progress');
    } else {
      alert('Please select at least one seat.');
    }
  };
  
  return (
    <div className="booking-system">
      <div className="seats">
        {seatsLayout.map(([row, count]) => (
          <div key={row} className="seat-row">
            <h3>{row}</h3>
            {[...Array(count).keys()].map((seatNumber) => (
              <Seat
                key={seatNumber}
                seatNumber={row + (seatNumber + 1)}
                isSelected={selectedSeats.includes(row + (seatNumber + 1))}
                isBooked={bookedSeats.includes(row + (seatNumber + 1))}
                onSelect={handleSeatSelect}
              />
            ))}
            <h3>{row}</h3>
          </div>
        ))}
      </div>
      <div>
        <h2>Selection:</h2>
        {/* Display the selected seats here */}
        <div>{selectedSeats.join(', ')}</div>
      </div>

      <button className="bookbutton" onClick={BookTicket} disabled={selectedSeats.length === 0}>
        Book Tickets
      </button>
    </div>
  );
};
