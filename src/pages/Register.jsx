import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { Link } from 'react-router-dom'; 
import './Login.css'; 

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone:'',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/register', formData);
      console.log('Registration successful:', response.data);
      // Optionally redirect to login page or show success message
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Create your account</h2>

        <label htmlFor="username">Enter Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Enter Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="phone">Enter Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          pattern="[0-9]{10}"
          title="Enter a valid 10-digit phone number"
        />

        <label htmlFor="password">Enter Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
        {/* Link to Login */}
        <p className="register-link">
          Back to Login? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
