import React, { useState, useEffect } from 'react';
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

export const Booking = ({ selectedMovie, movie, formatted, user, selectedDate, showtime }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const selected = movie.find((movie) => movie.moviename === selectedMovie);

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
      setSelectedSeats([...selectedSeats.sort(), seatNumber]);
    }

    // Save the updated selected seats to local storage
    saveSelectedSeatsToLocalStorage(selectedSeats);
  };

  const BookTicket = () => {
    if (selectedSeats.length > 0) {
      // Save the selected seats to local storage when the "Book Tickets" button is clicked
      saveSelectedSeatsToLocalStorage(selectedSeats);
      alert(`This Theatre ${user.name} this movie ${selectedMovie} this date ${selectedDate} this time ${showtime} This are Selected Seats ${selectedSeats}`);
    } else {
      alert('Please select at least one seat.');
    }
  };

  return (
    <div className="booking-system">
      <div className="seats">
        <h4>Selected Movie in Booking: {selectedMovie}</h4>
        {selected ? (
          <div>
            <h4>Selected Movie: {selectedMovie}</h4>
            <img width="350px" src={selected.poster} alt={selectedMovie} />
            {/* Other content of your Booking component */}
          </div>
        ) : (
          <div>
            <h4>No movie data found for {selectedMovie}</h4>
          </div>
        )}
        <br />
        <div id='scr'>
          <h3>Screen</h3>
        </div>
        <br />

        {/* Replace 'seatsLayout' with dynamic seat layout based on 'formattedString' */}
        {formatted.map(([row, count]) => (
          <div key={row} className="seat-row">
            <h3>{row}</h3>
            {[...Array(count).keys()].map((seatNumber) => (
              <Seat
                key={seatNumber}
                seatNumber={row + (seatNumber + 1)}
                isSelected={selectedSeats.includes(row + (seatNumber + 1))}
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
