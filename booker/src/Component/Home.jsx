import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/home.css';

export const Home = ({ user, onLogout }) => {
  const [movieData, setMovieData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
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
  };

  const handleMovieSelect = (movieName) => {
    setSelectedMovie(movieName);
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

  const filteredMovies = movieData.filter((movie) => movie.date === selectedDate);

  return (
    <div className="home-container">
      <h1>Welcome, {user.name}!</h1>
      <h4>Your location: {user.location}</h4>
      <h4>Your cinema name: {user.name}</h4>
      <h4>Your rows: {user.rows.map((row) => row.option).join(', ')}</h4>
      <h4>Your Number Of Seats: {user.rows.map((row) => row.seats).join(', ')}</h4>

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
          {filteredMovies
            .find((movie) => movie.date === selectedDate)
            .movieData[selectedMovie].map((showtime) => (
              <div key={showtime}>
                <input type="checkbox" id={showtime} name={showtime} value={showtime} />
                <label htmlFor={showtime}>{showtime}</label>
              </div>
            ))}
        </div>
      )}

      <Link to="/login">
        <button className='loginbtn' onClick={onLogout}>Logout</button>
      </Link>
    </div>
  );
};
