import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/LandingPage';
import ShareHandler from './components/ShareHandler';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Landing />} />
        <Route path="/share/:token" element={<ShareHandler />} />
        
      </Routes>
    </Router>
  );
}

export default App;
