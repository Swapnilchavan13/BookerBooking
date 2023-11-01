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
  const [moviee, setMovie] = useState([]);

  useEffect(() => {
    if (selectedDate && movieData.length > 0 && !selectedMovie) {
      const moviesForSelectedDate = movieData.find(movie => movie.date === selectedDate);

      if (moviesForSelectedDate) {
        const firstMovie = Object.keys(moviesForSelectedDate.movieData)[0];
        // console.log(filteredMovies)
        setSelectedMovie(firstMovie);
      }
    }
  }, [selectedDate, movieData, selectedMovie]);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch('http://62.72.59.146:3005/moviedata')
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

    fetch('http://62.72.59.146:3005/allocatedata')
      .then((response) => response.json())
      .then((data) => {
        // Filter the data based on user.name
        const filteredData = data.filter((item) => item.theatreName === user.name);
        setMovieData(filteredData);

        // Set the selectedDate to the first available date
        const firstAvailableDate = filteredData.find((movie) => new Date(movie.date) >= currentDate);
        if (firstAvailableDate) {
          setSelectedDate(firstAvailableDate.date);
        }
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
  // Filter out dates less than today's date
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  const uniqueDates = movieData
    .filter((movie) => new Date(movie.date) >= currentDate)
    .map((movie) => movie.date)
    .sort((a, b) => new Date(a) - new Date(b));

    const [currentIndex, setCurrentIndex] = useState(0);

const slideNext = () => {
  if (currentIndex < uniqueDates.length - 1) {
    setCurrentIndex(currentIndex + 1);
  }
};

const slidePrev = () => {
  if (currentIndex > 0) {
    setCurrentIndex(currentIndex - 1);
  }
};

  const dateButtons = uniqueDates.map((date) => {
    const dateObj = new Date(date);
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj);



    
    return (
      <button
      key={date}
      onClick={() => handleDateSelect(date)}
      className={selectedDate === date ? 'active' : ''}
      >
        {`${dayOfWeek.toLocaleUpperCase()} ${formatDate(date)}`}
      </button>
    );
  });
  // Create an array in the desired format
  const formattedData = user.rows.map((row) => [row.option, row.seats]);
  // To save it as a string in the format you mentioned:
  const formattedString = JSON.stringify(formattedData);
  const formatted = JSON.parse(formattedString);
  const filteredMovies = movieData.filter((movie) => movie.date === selectedDate);
  const currTime = new Date().getHours();
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();
  if (dd < 10) dd =  dd;
  if (mm < 10) mm = '0' + mm;
  const formattedToday = mm + '/' + dd + '/' + yyyy;
  // console.log(moviee)
  // console.log(selectedDate, formattedToday, currTime)

  return (
    <div className="home-container">
      <div className='maindiv'>
        <h1>Hello 👋, {user.name}!</h1>

        <Link to="/login">
          <button className='loginbtn' onClick={onLogout}>Logout</button>
        </Link>
      </div>
      <h4>Location: {user.location}</h4>
      {/* <h4>Cinema`s name: {user.name}</h4> */}
      <h3>Select a date: </h3>
      {/* <div className="date-buttons">
        {dateButtons}
      </div> */}

<div className="date-buttons">
      <button id='slidebtn' onClick={slidePrev}>{"<"}</button>
      <div className="slider">
        <div
          className="slider-content"
          style={{ transform: `translateX(-${currentIndex * 50}%)` }}
        >
          {dateButtons}
        </div>
      </div>
      <button onClick={slideNext}>{">"}</button>
    </div>

      {selectedDate && (
        <div>
          {/* <h2>Movies on {formatDate(selectedDate)} in {user.name}:</h2> */}
          <br />
          {
            filteredMovies.map((movie) => (
              <div className='mvdiv' key={movie._id}>
                {Object.keys(movie.movieData).map((movieName) => {
                  return (
                    <div key={movieName} className="movie-poster">
                      <div
                        onClick={() => handleMovieSelect(movieName)}
                        className={selectedMovie === movieName ? 'active' : 'mvbtn'}
                      >
                        {movieName}
                        {moviee.map((item, index) => (
                          <div key={index} className="movie-item">
                            {item.moviename === movieName && (
                              <div>
                                <img className='img' width="80px" height="120px" src={item.poster} alt={item.name} />
                              </div>
                            )}
                          </div>

                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      )}

      {selectedMovie && (
        <div>
          {/* <h3>Movie: {selectedMovie}</h3> */}
          <h4>Showtimes:</h4>
          <div className="showdiv">
            {filteredMovies
              .find((movie) => movie.date === selectedDate)
              .movieData[selectedMovie].map((showtime) => {
                const isDisabled =
                  (showtime === "9:00 AM" && selectedDate === formattedToday && 9 <= currTime) ||
                  (showtime === "12:00 PM" && selectedDate === formattedToday && 12 <= currTime) ||
                  (showtime === "3:00 PM" && selectedDate === formattedToday && 15 <= currTime) ||
                  (showtime === "6:00 PM" && selectedDate === formattedToday && 18 <= currTime) ||
                  (showtime === "9:00 PM" && selectedDate === formattedToday && 21 <= currTime);

                if (!isDisabled && selectedShowtime === null) {
                  // Set the first available non-disabled showtime as the default
                  handleShowtimeSelect(showtime);
                }

                return (
                  <div key={showtime}>
                    <input
                      type="radio"
                      id={showtime}
                      name="showtime"
                      value={showtime}
                      checked={selectedShowtime === showtime}
                      onChange={() => handleShowtimeSelect(showtime)}
                      disabled={isDisabled}
                    />
                    <label htmlFor={showtime}>{showtime}</label>
                  </div>
                );
              })}
          </div>
          <Booking
            selectedMovie={selectedMovie}
            movie={moviee}
            formatted={formatted}
            user={user}
            showtime={selectedShowtime} // Default or selected non-disabled showtime
            selectedDate={selectedDate}
          />
        </div>
      )}

    </div>
  );
};