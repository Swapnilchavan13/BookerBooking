import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/home.css';
import '../Styles/now.css';

export const NowandComming = ({ user, onLogout }) => {

  const [authenticated, setAuthenticated] = useState(true);
  const [moviee, setMovie] = useState([]);
  const [nowShowingClicked, setNowShowingClicked] = useState(true);
  const [comingSoonClicked, setComingSoonClicked] = useState(false);

  const containerRef = useRef();

  const toggleNowShowing = () => {
    setNowShowingClicked(!nowShowingClicked);
    setComingSoonClicked(false);
  };

  const toggleComingSoon = () => {
    setComingSoonClicked(!comingSoonClicked);
    setNowShowingClicked(false);
  };

  useEffect(() => {
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
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    if (isAuthenticated) {
      setAuthenticated(true);
    }
  }, [user.name]);

  const Bookhandle = (movieName) => {
    // Save the selected movie name in localStorage
    localStorage.setItem('selMovie', movieName);
  };
  

  return (
    <div className="home-container">
      <div className='maindiv'>
        <img src="https://cinemass.vercel.app/_next/static/media/cinema-logo.a5a66603.svg" alt="" />
        <Link to="/login">
          <button className='logoutbtn' onClick={onLogout}>Logout</button>
        </Link>
      </div>
      <h4>Location: {user.location}</h4>
      <div className='adbook'>
        <h4
          onClick={toggleNowShowing}
          style={{
            backgroundColor: nowShowingClicked ? 'white' : 'initial',
            color: nowShowingClicked ? 'initial' : 'white'
          }}
        >
          Now Showing {nowShowingClicked ? '🔼' : '🔽'}
        </h4>
        {/* <h4
          onClick={toggleComingSoon}
          style={{
            backgroundColor: comingSoonClicked ? 'white' : 'initial',
            color: comingSoonClicked ? 'initial' : 'white'
          }}
        >
          Coming Soon {comingSoonClicked ? '🔼' : '🔽'}
        </h4> */}
      </div>

      <div ref={containerRef} className="movie-container">
        {nowShowingClicked && (
          <div>
            {moviee.map((item, index) => (
              <div key={index} className="movie-item">
                <div className='imgdiv'>
                  <h3>{item.movieName}</h3>
                  <img src={item.posterImage} alt={item.name} />
                  <Link to="/home">
                  <button onClick={() => Bookhandle(item.movieName)}>Book Now</button>
                  </Link>
                </div>
                <br />
              </div>
            ))}
          </div>
        )}

        {comingSoonClicked && (
          <div ref={containerRef} className="movie-container">
          {comingSoonClicked && (
            // <div>
            //   {moviee.map((item, index) => (
            //     <div key={index} className="movie-item">
            //       <div className='imgdiv'>
            //         <h3>{item.moviename}</h3>
            //         <img src={item.poster} alt={item.name} />
            //         <Link to="/home">
            //         <button onClick={Bookhandle}>Book In Advance</button>
            //         </Link>
            //       </div>
            //       <br />
            //     </div>
            //   ))}
            // </div>
            <div>
             <h1>No Upcoming Movies...</h1>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
};
