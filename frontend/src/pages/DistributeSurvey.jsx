import React, { useEffect, useState } from 'react';
import { listSurveys, sendSurveyEmail } from '../api/surveyApi';

const DistributeSurvey = () => {
  //State declarations
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');

  // Fetch available surveys on component mount
  useEffect(() => {
    const fetchSurveys = async () => {
      const res = await listSurveys();
      setSurveys(res.data);
    };
    fetchSurveys();
  }, []);

  // Handle sending survey email
  const handleSend = async () => {
    if (!selectedSurvey || !recipientEmail) return alert('All fields are required');
    await sendSurveyEmail({ survey_id: selectedSurvey, email: recipientEmail });
    alert('Survey link sent!');
    setRecipientEmail(''); // Clear email input after sending
  };

  return (
    <div className="container mt-5">
      <h4>Distribute Survey</h4>
      <select
        className="form-control my-2"
        value={selectedSurvey}
        onChange={e => setSelectedSurvey(e.target.value)}
      >
        <option value="">Select a Survey</option>
        {surveys.map(s => (
          <option key={s.id} value={s.id}>{s.title}</option>
        ))}
      </select>
      <input
        type="email"
        className="form-control my-2"
        placeholder="Recipient Email"
        value={recipientEmail}
        onChange={e => setRecipientEmail(e.target.value)}
      />
      <br></br>
      <button className="btn btn-primary" onClick={handleSend}>Send Survey Link</button>
    </div>
  );
};

export default DistributeSurvey;
