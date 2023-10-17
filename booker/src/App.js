import './App.css';
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import { Login } from './Component/Login';
import { Home } from './Component/Home';
import { useState } from 'react';


function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setAuthenticated(false);
    setUser(null); // Clear the user data
  };

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login authenticated={authenticated} setAuthenticated={setAuthenticated} setUser={setUser} />} />
      <Route path="/home" element={authenticated ? <Home user={user}  onLogout={handleLogout} /> : <Login authenticated={authenticated} />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
