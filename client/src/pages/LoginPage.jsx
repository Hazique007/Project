import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('email', email);
      setSuccessMsg('Login successful!');
      setErrorMsg('');

      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
      setSuccessMsg('');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ height: '100vh', width: '100vw' }}
    >
      <div
        className="card p-5 shadow-lg rounded-4"
        style={{ width: '400px', maxWidth: '90%' }}
      >
        <h3 className="text-center mb-4 fw-semibold">Welcome Back 👋</h3>

        {errorMsg && (
          <div className="alert alert-danger text-center py-2">{errorMsg}</div>
        )}
        {successMsg && (
          <div className="alert alert-success text-center py-2">{successMsg}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>

          <div className="text-center mt-3">
            <small className="text-muted">
              Don't have an account? <a href="#">Sign Up</a>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
