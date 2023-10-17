import React from 'react';
import { Link } from 'react-router-dom';

export const Home = ({ user ,onLogout }) => {
    
  return (
    <div className='login-container'>
      <h1>Welcome, {user.name}!</h1>
      <h4>Your location: {user.location}</h4>
      <h4>Your cinema name: {user.name}</h4>
      <h4>Your rows: {user.rows.map((row) => row.option).join(', ')}</h4>
      <h4>Your Number Of Seats: {user.rows.map((row) => row.seats).join(', ')}</h4>
      <Link to='/login'>
      <button onClick={onLogout}>Logout</button>
      </Link>
    </div>
  );
};
