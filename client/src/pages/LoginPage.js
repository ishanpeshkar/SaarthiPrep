import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login, isAuthenticated, error, clearErrors } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    if (error) {
      // Using an alert for now, but a styled component would be better
      alert(error);
      clearErrors(); // Clear the error after showing it
    }
  }, [isAuthenticated, error, navigate, clearErrors]);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      // You can add more specific form validation here
      alert('Please fill in all fields');
    } else {
      login({ email, password });
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>Login to SaarthiPrep</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
        <p className="switch-auth">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;