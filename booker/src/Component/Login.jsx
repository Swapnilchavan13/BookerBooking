import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    loginId: '',
    password: '',
  });

  const [movies, setMovies] = useState([]);
  const audioRef = useRef(null);

  // Fetch movie data from the API
  useEffect(() => {
    axios.get('http://62.72.59.146:3005/moviedata')
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch movie data:', error);
      });
  }, []);

  // Check if the user is already authenticated on component mount
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('authenticated') === 'true');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    const { loginId, password } = loginData;
    setAuthenticated(true);

    try {
      const response = await axios.get('http://62.72.59.146:3005/theatredata');
      const validUser = response.data.find(
        (user) => user.loginid === loginId && user.password === password
      );

      if (validUser) {
        setUser(validUser); // Pass the user data to the Home component
        navigate('/userslogin');
        // Store authentication state and user data in localStorage
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('user', JSON.stringify(validUser));
        window.location.reload(false)
      } else {
        alert('Login failed. Please check your credentials.');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to fetch user data from the API. Please try again later.');
      navigate('/login');
    }
  };

  useEffect(() => {
    // Add an event listener to play audio after the page is fully loaded
    const handleDOMContentLoaded = () => {
      const audioElement = audioRef.current;
      if (audioElement) {
        audioElement.play();
      }
    };
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
    };
  }, []);

  return (
    <>
      <div className="login-container">
        <div className="login-form">
          <img src="https://cinemass.vercel.app/_next/static/media/cinema-logo.a5a66603.svg" alt="" />
          <h1>Login</h1>
          <input
            type="text"
            name="loginId"
            placeholder="Login ID"
            value={loginData.loginId}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleInputChange}
          />
          <button className='loginbtn' onClick={handleLogin}>Login</button>
          {authenticated}
        </div>
      </div>

      <audio ref={audioRef} src="cinemass.mp3" autoPlay />

      <div className="background-posters">
        {/* Display movie posters as background images */}
        {movies.map((movie, index) => (
          <div
            className={`movie-pos poster${index + 1}`}
            key={movie._id}
            style={{ backgroundImage: `url(${movie.poster})` }}
          ></div>
        ))}
      </div>
    </>

  );
};
