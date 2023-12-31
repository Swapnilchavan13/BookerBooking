import React, { useEffect, useState } from 'react';
import '../Styles/booking.css';
import { useNavigate } from 'react-router-dom';

const Seat = ({ seatNumber, isSelected, isBooked, isSaved, onSelect }) => {
  // Determine the initial class based on isSelected and isSaved
  const seatClassName = isSelected
    ? 'seat selected'
    : isSaved
      ? 'seat booked'
      : 'seat';

  const handleClick = () => {
    if (!isBooked) {
      onSelect(seatNumber);
    } else {
      // Toggle the isSelected state for the clicked seat
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

  const selectedmv = movie.find((movie) => movie.moviename === selectedMovie);
  const bookername = localStorage.getItem('bookerusers')

  useEffect(() => {
    fetch('http://62.72.59.146:3005/bookingdata')
      .then((response) => response.json())
      .then((data) => setApiData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      // If the seat is already selected, deselect it
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      // If the seat is not selected, select it
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const data = {
    booker: bookername,
    tname: user.name,
    mname: selectedMovie,
    sdate: selectedDate,
    showtime: showtime,
    seats: selectedSeats.sort(),
  };

  // const BookTicket = () => {
  //   if (selectedSeats.length > 0 && showtime) {
  //     alert(`Welcome to ${user.name}! We are excited to host you for the screening of ${selectedMovie} on ${selectedDate} at ${showtime}. Your reservation includes the following selected seats: ${selectedSeats}.`);
  //     localStorage.setItem('data', JSON.stringify(data));
  //     navigate('/details');
  //   } else {
  //     alert('Please select Showtime.');
  //   }
  // };

  // Open the custom popup
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

  // Usage in your BookTicket function
  const BookTicket = () => {
    if (selectedSeats.length > 0 && showtime) {
      var message = `Welcome to ${user.name}! We are excited to host you for the screening of ${selectedMovie} on ${selectedDate} at ${showtime}. Your reservation includes the following selected seats: ${selectedSeats}.`;
      openPopup(message);
      localStorage.setItem('data', JSON.stringify(data));
    } else {
      openPopup('Please select Showtime.');
    }
  };

  return (
    <div className="booking-system">
      <div className="seats">
        <h4>Selected Movie in Booking: {selectedMovie}</h4>
        {/* {selectedmv ? (
          <div className='pdiv'>
            <img className='pimg' src={selectedmv.poster} alt={selectedMovie} />
          </div>
        ) : (
          <div>
            <h4>No movie data found for {selectedMovie}</h4>
          </div>
        )} */}
        <br />
        <div id='bdiv'>
          <div className='bs'></div>
          <p>Booked Seats</p>
          <div className='as'></div>
          <p>Available Seats</p>
        </div>
        <br />
        <div id="scr">Screen</div>
        <br />
        {formatted.map(([row, count]) => (
          <div key={row} id='srow' className="seat-row">
            <h3>{row}</h3>
            {[...Array(count).keys()].map((seatNumber) => {
              const seatNumberStr = row + (seatNumber + 1);
              const isBooked = selectedSeats.includes(seatNumberStr);
              const isSaved = apiData.some((booking) =>
                booking.tname === user.name &&
                booking.sdate === selectedDate &&
                booking.mname === selectedMovie &&
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
        <div className='seatsnamount'>
          <h5>Selected Seats</h5>
          <div>{selectedSeats.join(', ')}</div>
          <h5>Total Amount</h5>
          <div>Rs. {selectedSeats.length * 100} /-</div>
        </div>
      </div>

      <button
        className="bookbutton"
        onClick={BookTicket}
        disabled={selectedSeats.length === 0}
      >
        Book Tickets
      </button>
      <div id="customPopup" className="modal">
        <div className="modal-content">
          <span className="close" onClick={closePopup}>&times;</span>
          <p id="popupMessage"></p>
        </div>
      </div>
    </div>
  );
}
