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
        const filteredData = data.filter((item) => item.theatreId === user._id);
        setMovieData(filteredData);

        // Set the selectedDate to the first available date
        const firstAvailableDate = filteredData.find((movie) => new Date(movie.date) >= currentDate);
        
        const smov = localStorage.getItem("selMovie");
        // console.log(smov);

const fmovie = filteredData.find((movie) => {
  // Get the movie names from the movieData object
  const movieNames = Object.keys(movie.movieData);

  // Check if the stored movie name (smov) exists in the movie names
  if (movieNames.includes(smov)) {
    return true;
  }

  return false;
});

// console.log(fmovie);

if (fmovie) {
  const selectedDate = fmovie.date;
  // console.log('Selected Date:', selectedDate);
  setSelectedDate(selectedDate);

  return selectedDate;
} else {
  // Handle the case when the movie name doesn't match any in the filteredData
  // console.log('Movie not found in filteredData');
  // You can return a default value or handle it as needed
  if (firstAvailableDate) {
    setSelectedDate(firstAvailableDate.date);
  }
  return null; // Or any other appropriate value
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
        <img src="https://i.postimg.cc/6QfKJ4Qc/cinemasslogo.png" alt="" />

        <Link to="/login">
          <button className='logoutbtn' onClick={onLogout}>Logout</button>
        </Link>
      </div>
      <h4>Location: {user.theatreCity}</h4>
      <h3>Select a Date: {selectedDate}</h3>
     <div className="date-buttons">
      <button id='slidebtn' onClick={slidePrev}>{"◀"}</button>
      <div className="slider">
        <div
          className="slider-content"
          style={{ transform: `translateX(-${currentIndex * 50}%)` }}
        >
          {dateButtons}
        </div>
      </div>
      <button onClick={slideNext}>{"▶"}</button>
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
                    <div key={movieName} id='mvp' className="movie-poster">
                      <div
                        onClick={() => handleMovieSelect(movieName)}
                        className={selectedMovie === movieName ? 'active' : 'mvbtn'}
                      >
                        {movieName}
                        {moviee.map((item, index) => (
                          <div key={index} className="movie-item">
                            {item.movieName === movieName && (
                              <div>
                                <img className='img' width="80px" height="140px" src={item.posterImage} alt={item.movieName} />
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
<br />
<br />
      {selectedMovie && (
        <div>
          {/* <h3>Movie: {selectedMovie}</h3> */}
          <h4 className='sshowtime'>Select Showtimes</h4>
          <div className="showdiv">
            {filteredMovies
              .find((movie) => movie.date === selectedDate)
              .movieData[selectedMovie].map((showTime) => {
                const isDisabled =
                  (showTime === "9:00 AM" && selectedDate === formattedToday && 10 <= currTime) ||
                  (showTime === "12:00 PM" && selectedDate === formattedToday && 13 <= currTime) ||
                  (showTime === "3:00 PM" && selectedDate === formattedToday && 16 <= currTime) ||
                  (showTime === "4:00 PM" && selectedDate === formattedToday && 17 <= currTime) ||
                  (showTime === "6:00 PM" && selectedDate === formattedToday && 19 <= currTime) ||
                  (showTime === "9:00 PM" && selectedDate === formattedToday && 22 <= currTime);

                  if (!isDisabled && selectedShowtime === null) {
                  // Set the first available non-disabled showtime as the default
                  handleShowtimeSelect(showTime); 
                }

                return (
                  <div key={showTime}>
                    <input
                      type="radio"
                      id={showTime}
                      name="showtime"
                      value={showTime}
                      checked={selectedShowtime === showTime}
                      onChange={() => handleShowtimeSelect(showTime)}
                      disabled={isDisabled}
                    />
                    <label htmlFor={showTime}>{showTime}</label>
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