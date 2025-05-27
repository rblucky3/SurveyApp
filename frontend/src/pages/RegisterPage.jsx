import React, { useEffect, useState } from 'react';
import { register, getTeams } from '../api/surveyApi';

export default function Register() {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    team_id: '',
  });

  useEffect(() => {
    getTeams()
      .then(res => setTeams(res.data))
      .catch(err => console.error('Failed to load teams:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData)
      .then(() => alert('Registration successful'))
      .catch(err => alert('Error: ' + err.response?.data?.message || 'Failed to register'));
  };

  return (
    <div className="container mt-5">
      <h2>Register User</h2>
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" name="email" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" name="password" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Team</label>
          <select className="form-select" name="team_id" onChange={handleChange} required>
            <option value="">Select a Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}
