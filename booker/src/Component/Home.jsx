import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/home.css';
import { Booking } from './Booking';

export const Home = ({ user, onLogout }) => {
  const [movieData, setMovieData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [authenticated, setAuthenticated] = useState(false); // Initialize as not authenticated
  const [movie, setMovie] = useState([]);

useEffect(() => {
  // Fetch data from your API endpoint
  fetch('http://localhost:3005/moviedata')
    .then((response) => response.json())
    .then((data) => {
      setMovie(data);
    })
    .catch((error) => {
      console.error('Error fetching movie data:', error);
    });
}, []);

  useEffect(() => {
    // Check if the user is already authenticated on component mount
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    if (isAuthenticated) {
      setAuthenticated(true);
    }

    // Fetch data from your API endpoint
    fetch('http://localhost:3005/allocatedata')
      .then((response) => response.json())
      .then((data) => {
        // Filter the data based on user.name
        const filteredData = data.filter((item) => item.theatreName === user.name);
        setMovieData(filteredData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [user.name]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.getDate(); // Get only the day component from the date.
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedMovie(null); // Clear selected movie when a new date is selected.
    setSelectedShowtime(null); // Clear selected showtime when a new date is selected.
  };

  const handleMovieSelect = (movieName) => {
    setSelectedMovie(movieName);
    setSelectedShowtime(null); // Clear selected showtime when a new movie is selected.
  };

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
  };

  const handleLogout = () => {
    // Clear authentication state in localStorage
    localStorage.setItem('authenticated', 'false');
    // Continue with your logout logic
    onLogout();
  };
  
  // Filter out dates less than today's date
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  const dateButtons = movieData
    .filter((movie) => new Date(movie.date) >= currentDate)
    .map((movie) => (
      <button
        key={movie.date}
        onClick={() => handleDateSelect(movie.date)}
        className={selectedDate === movie.date ? 'active' : ''}
      >
        {formatDate(movie.date)} {/* Format the date to display only the day */}
      </button>
    ));

// Create an array in the desired format
const formattedData = user.rows.map((row) => [row.option, row.seats]);
// To save it as a string in the format you mentioned:
const formattedString = JSON.stringify(formattedData);

const formatted = JSON.parse(formattedString);

const filteredMovies = movieData.filter((movie) => movie.date === selectedDate);

const currTime = new Date().getHours();

  return (
    <div className="home-container">
      <h1>Welcome, {user.name}!</h1>
      <h4>Location: {user.location}</h4>
      <h4>Cinema`s name: {user.name}</h4>

      <div className="date-buttons">
        <h4>Select a date:</h4>
        {dateButtons}
      </div>

      {selectedDate && (
        <div>
          <h2>Movies on {formatDate(selectedDate)} in {user.name}:</h2>
          {filteredMovies.map((movie) => (
            <div className='mvdiv' key={movie._id}>
              {Object.keys(movie.movieData).map((movieName) => (
                <button
                  key={movieName}
                  onClick={() => handleMovieSelect(movieName)}
                  className={selectedMovie === movieName ? 'active' : 'mvbtn'}
                >
                  {movieName}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {selectedMovie && (
        <div>
          <h3>Movie: {selectedMovie}</h3>
          <h4>Showtimes:</h4>
          <div className='showdiv'>
          {filteredMovies
            .find((movie) => movie.date === selectedDate)
            .movieData[selectedMovie].map((showtime) => (
            <div id='showtm'>
              <div key={showtime}>
                <input
                  type="radio"
                  id={showtime}
                  name="showtime"
                  value={showtime}
                  checked={selectedShowtime === showtime}
                  onChange={() => handleShowtimeSelect(showtime)}
                  disabled={
                 showtime === "9:00 AM" && 9 < currTime
                || showtime === "12:00 PM" && 12 <= currTime 
                || showtime === "3:00 PM" && 15 <= currTime 
                || showtime === "6:00 PM" && 18 <= currTime
                || showtime === "9:00 PM" && 21 <= currTime
              } />
                <label htmlFor={showtime}>{showtime}</label>
              </div>
              </div>
            ))}
            </div>
            
            <Booking selectedMovie={selectedMovie} movie={movie} formatted={formatted} user={user} showtime={selectedShowtime} selectedDate={selectedDate}/>
        </div>
      )}

      <Link to="/login">
        <button className='loginbtn' onClick={onLogout}>Logout</button>
      </Link>
    </div>
  );
};
