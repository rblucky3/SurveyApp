import React, { useState } from 'react';
import { createTeam } from '../api/surveyApi';

export default function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTeam({ name: teamName });
      setMessage('Team created successfully!');
      setTeamName('');
    } catch (err) {
      setMessage('Error creating team: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a Team</h2>
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <label htmlFor="teamName" className="form-label">Team Name</label>
          <input
            type="text"
            className="form-control"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Create Team</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
