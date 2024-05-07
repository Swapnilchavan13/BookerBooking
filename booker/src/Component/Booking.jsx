import React, { useEffect, useState } from 'react';
import '../Styles/booking.css';
import { useNavigate } from 'react-router-dom';

// Inside your Seat component
const Seat = ({ seatNumber, isSelected, isBooked, isSaved, isCancel, onSelect }) => {
  // Determine the initial class based on isSelected and isSaved
  let seatClassName = 'seat';
  
  if (isSelected) {
    seatClassName += ' selected';
  } else if (isSaved && !isBooked && !isCancel) {
    seatClassName += ' booked';
  }

  const handleClick = () => {
    // Allow selecting the seat if it's not booked or canceled
    if (!isBooked && !isCancel) {
      onSelect(seatNumber);
    }
  };

  return (
    <div className={seatClassName} onClick={handleClick}>
      {seatNumber}
    </div>
  );
};

export const Booking = ({
  selectedMovie,
  movie,
  formatted,
  user,
  selectedDate,
  showtime,
}) => {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [userBookings, setUserBookings] = useState([]);

  const selectedmv = movie.find((movie) => movie.moviename === selectedMovie);
  const bookername = localStorage.getItem('bookerusers');

  useEffect(() => {
    fetch('http://62.72.59.146:3005/bookingdata')
      .then((response) => response.json())
      .then((data) => setApiData(data))
      .catch((error) => console.error('Error fetching data:', error));

    // Fetch user's bookings
    fetch(`http://62.72.59.146:3005/bookingdata?userId=${user.loginId}`)
      .then((response) => response.json())
      .then((data) => setUserBookings(data))
      .catch((error) => console.error('Error fetching user bookings:', error));
  }, [user.loginId]);

  const handleSeatSelect = (seatNumber) => {
    // Deselect all previously selected seats
    const newSelectedSeats = [seatNumber];
    setSelectedSeats(newSelectedSeats);
  };

  const data = {
    userId: 1,
    cardId: 537923476,
    theatreId: user.theatreId,
    screenId: user.theaterScreens,
    theatreName: user.theatreName,
    movieName: selectedMovie,
    showDate: selectedDate,
    showTime: showtime,
    isCancel: false,
    seats: selectedSeats.sort(),
  };

  const cancelBooking = async (bookingId, canceledSeats) => {
    try {
      const response = await fetch(`http://62.72.59.146:3005/bookingdata/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCancel: true }),
      });
  
      if (response.ok) {
        // Update the UI or refetch user bookings
        const updatedBookings = userBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, isCancel: true } : booking
        );
        setUserBookings(updatedBookings);
  
        // Update the seat availability in the frontend
        const updatedSelectedSeats = selectedSeats.filter(seat => !canceledSeats.includes(seat));
        setSelectedSeats(updatedSelectedSeats);
      } else {
        console.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };
  
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
        <br />
        <div id="bdiv">
          <div className="bs"></div>
          <p>Booked Seats</p>
          <div className="as"></div>
          <p>Available Seats</p>
        </div>
        <br />
        <div id="scr">Screen</div>
        <br />
        {formatted.map(([row, count]) => (
  <div key={row} id="srow" className="seat-row">
    <h3>{row}</h3>
    {[...Array(count).keys()].map((seatNumber) => {
      const seatNumberStr = row + (seatNumber + 1);
      const isBooked = selectedSeats.includes(seatNumberStr);
      const isSaved = apiData.some(
        (booking) =>
          booking.theatreName === user.theatreName &&
          booking.showDate === selectedDate &&
          booking.movieName === selectedMovie &&
          booking.showTime === showtime &&
          booking.seats.includes(seatNumberStr)
      );

      // Determine if the seat is canceled
      const bookingInfo = userBookings.find(
        (booking) =>
          booking.theatreName === user.theatreName &&
          booking.showDate === selectedDate &&
          booking.movieName === selectedMovie &&
          booking.showTime === showtime &&
          booking.seats.includes(seatNumberStr)
      );
      const isCancel = bookingInfo ? bookingInfo.isCancel : false;

      // Show available seats for both canceled and non-canceled bookings
      if ( isCancel) {
        return (
          <Seat
            key={seatNumberStr}
            seatNumber={seatNumberStr}
            isSelected={selectedSeats.includes(seatNumberStr)}
            isBooked={isBooked}
            isSaved={isSaved}
            isCancel={isCancel}
            onSelect={handleSeatSelect}
          />
        );
      } else {
        // Show regular booked seats
        return (
          <Seat
            key={seatNumberStr}
            seatNumber={seatNumberStr}
            isSelected={selectedSeats.includes(seatNumberStr)}
            isBooked={isBooked}
            isSaved={isSaved}
            isCancel={isCancel}
            onSelect={handleSeatSelect}
          />
        );
      }
    })}
    <h3>{row}</h3>
  </div>
))}
  </div>

      <div>
        <div className="seatsnamount">
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
      
      {/* User Bookings Section */}
      <div className="user-bookings">
        <h3>Your Bookings</h3>
        {userBookings.map((booking) => (
          <div key={booking._id}>
            <p style={{color:"white"}}>
              {booking.movieName} - {booking.showDate} - {booking.showTime}
              {booking.isCancel ? (
                <span> - Canceled</span>
              ) : (
                <button onClick={() => cancelBooking(booking._id)}>Cancel</button>
              )}
            </p>
          </div>
        ))}
      </div>

      <div id="customPopup" className="modal">
        <div className="modal-content">
          <span className="close" onClick={closePopup}>
            &times;
          </span>
          <p id="popupMessage"></p>
        </div>
      </div>
    </div>
  );
};
