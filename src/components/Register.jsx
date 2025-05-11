import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already exists
    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      toast.error('Email already exists!');
      return;
    }

    // Add new user
    const newUser = { name, email, password, role };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    toast.success('Registration successful!');
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="registration-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit" >Register</button>
      </form>
      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
};

export default Register;