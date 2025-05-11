import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import About from './About';
import Blog from './Blog';
import '../styles/Main.css';

const Main = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">Task Management</div>
        <ul className="navbar-nav">
          {!loggedInUser && (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <Link to="/about" className="nav-link">About</Link>
          </li>
          <li className="nav-item">
            <Link to="/blog" className="nav-link">Blog</Link>
          </li>
          {loggedInUser && (
            <li className="nav-item">
              <Link 
                to="/" 
                className="nav-link"
                onClick={() => {
                  localStorage.removeItem('loggedInUser');
                  window.location.href = '/';
                }}
              >
                Logout
              </Link>
            </li>
          )}
        </ul>
      </nav>
      

      <div className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </div>
      </div>
    
  );
};

export default Main;