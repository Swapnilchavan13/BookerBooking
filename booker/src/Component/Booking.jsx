import React, { useEffect, useState } from 'react';
import '../Styles/booking.css';
import { useNavigate } from 'react-router-dom';

const Seat = ({ seatNumber, isSelected, isBooked, isSaved, onSelect }) => {
  const seatClassName = isSelected
    ? 'seat selected'
    : isBooked || isSaved
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
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [apiData, setApiData] = useState([]);

  const selected = movie.find((movie) => movie.moviename === selectedMovie);

  useEffect(() => {
    fetch('http://localhost:3005/bookingdata')
      .then((response) => response.json())
      .then((data) => setApiData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Function to handle seat selection
  const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats.sort(), seatNumber]);
    }

    // Save the updated selected seats to local storage
    // saveSelectedSeatsToLocalStorage(selectedSeats);
  };


  const data = {
    tname: user.name,
    mname: selectedMovie,
    sdate: selectedDate,
    showtime: showtime,
    seats: selectedSeats.sort(),
  };

  const BookTicket = () => {
    if (selectedSeats.length > 0) {
      alert(
        `This Theatre ${user.name} this movie ${selectedMovie} this date ${selectedDate} this time ${showtime} This are Selected Seats ${selectedSeats}`
      );
      localStorage.setItem('data', JSON.stringify(data));
      navigate('/details');
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
          </div>
        ) : (
          <div>
            <h4>No movie data found for {selectedMovie}</h4>
          </div>
        )}
        <br />
        <div id="scr">Screen</div>
        <br />
        {formatted.map(([row, count]) => (
          <div key={row} className="seat-row">
            <h3>{row}</h3>
            {[...Array(count).keys()].map((seatNumber) => {
              const seatNumberStr = row + (seatNumber + 1);
              const isBooked = selectedSeats.includes(seatNumberStr);
              const isSaved = apiData.some((booking) =>
                booking.tname === user.name &&
                booking.mname === selectedMovie &&
                booking.sdate === selectedDate &&
                booking.showtime === showtime &&
                booking.seats.includes(seatNumberStr)
              );

              return (
                <Seat
                  key={seatNumberStr}
                  seatNumber={seatNumberStr}
                  isSelected={selectedSeats.includes(seatNumberStr)}
                  isBooked={isBooked}
                  isSaved={isSaved}
                  onSelect={handleSeatSelect}
                />
              );
            })}
            <h3>{row}</h3>
          </div>
        ))}
      </div>
      <div>
        <h2>Selection:</h2>
        <div>{selectedSeats.join(', ')}</div>
      </div>

      <button
        className="bookbutton"
        onClick={BookTicket}
        disabled={selectedSeats.length === 0}
      >
        Book Tickets
      </button>
    </div>
  );
};
