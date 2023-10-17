import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './Component/Login';
import { Home } from './Component/Home';
import { useState, useEffect } from 'react';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for user authentication state and user data in localStorage on component mount
  useEffect(() => {
    const storedAuthenticated = localStorage.getItem('authenticated');
    if (storedAuthenticated === 'true') {
      setAuthenticated(true);
    }

    const storedUserData = JSON.parse(localStorage.getItem('user'));
    if (storedUserData) {
      setUser(storedUserData);
    }
  }, []);

  const handleLogout = () => {
    setAuthenticated(false);
    setUser(null); // Clear the user data
    // Clear authentication state and user data in localStorage
    localStorage.setItem('authenticated', 'false');
    localStorage.removeItem('user');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              authenticated={authenticated}
              setAuthenticated={setAuthenticated}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/home"
          element={
            authenticated ? (
              <Home user={user} onLogout={handleLogout} authenticated={authenticated} />
            ) : (
              <Login authenticated={authenticated} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
