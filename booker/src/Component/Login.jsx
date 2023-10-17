import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/login.css'; // Import the CSS file

export const Login = ({ authenticated, setAuthenticated, setUser }) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    loginId: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    const { loginId, password } = loginData;

    try {
      const response = await axios.get('http://localhost:3005/theatredata');
      const validUser = response.data.find(
        (user) => user.loginid === loginId && user.password === password
      );

      if (validUser) {
        setAuthenticated(true);
        setUser(validUser); // Pass the user data to the Home component
        navigate('/home');
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

  return (
    <div className="login-container">
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
      {authenticated && <p>Login successful! You can access the home page now.</p>}
    </div>
  );
};
