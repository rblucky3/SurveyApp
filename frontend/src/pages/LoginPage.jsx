import React, { useState } from 'react';
import { login } from '../api/surveyApi';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    localStorage.setItem('token', res.data.token);
    alert("Logged in!");
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <h2>Login</h2>
      <input className="form-control mb-2" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" className="form-control mb-2" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <button className="btn btn-success">Login</button>
    </form>
  );
};

export default LoginPage;
