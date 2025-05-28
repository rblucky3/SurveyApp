
import React, { useEffect, useState } from 'react';
import { listSurveys, uploadSurveyResponsesCSV } from '../api/surveyApi';

const UploadSurveyCSV = () => {
  // State to store the list of surveys fetched from the backend
  const [surveys, setSurveys] = useState([]);

  // State to store the selected survey ID
  const [selectedSurveyId, setSelectedSurveyId] = useState('');

  // State to store the uploaded CSV file
  const [file, setFile] = useState(null);

  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch list of surveys on component mount
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await listSurveys(); // API call to get surveys
        setSurveys(response.data); 
      } catch (err) {
        console.error('Failed to fetch surveys', err);
        setError('Failed to fetch surveys.'); 
      }
    };

    fetchSurveys(); 
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Save the selected file to state
  };

  // Handle form submission
  const handleUpload = async (e) => {
    e.preventDefault();

    // Validate if both survey and file are selected
    if (!selectedSurveyId || !file) {
      setError('Please select a survey and upload a CSV file.');
      return;
    }

    try {
      await uploadSurveyResponsesCSV(selectedSurveyId, file); // Upload file to backend
      setMessage('Responses uploaded successfully!'); // Show success message
      setError(''); // Clear any previous error
    } catch (err) {
      console.error(err);
      setError('Failed to upload responses.'); // Show error on failure
      setMessage(''); // Clear any previous message
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Upload Survey Responses (CSV)</h2>

      {/* Display error or success messages */}
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {/* Form for uploading CSV responses */}

      <form onSubmit={handleUpload}>
        <div className="mb-3">
          <label htmlFor="surveySelect" className="form-label">Select Survey</label>
          <select
            id="surveySelect"
            className="form-select"
            value={selectedSurveyId}
            onChange={(e) => setSelectedSurveyId(e.target.value)}
          >
            <option value="">-- Select a survey --</option>
            {surveys.map((survey) => (
              <option key={survey.id} value={survey.id}>
                {survey.title}
              </option>
            ))}
          </select>
        </div>

        {/* File input for CSV upload */}
        <div className="mb-3">
          <label htmlFor="csvFile" className="form-label">CSV File</label>
          <input
            type="file"
            className="form-control"
            id="csvFile"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>

       
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>
    </div>
  );
};

export default UploadSurveyCSV;


