// src/pages/TakeSurvey.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSurvey, listSurveys, submitResponses } from '../api/surveyApi';

const TakeSurvey = () => {
  const navigate = useNavigate();

  //State declarations
  const [surveyList, setSurveyList] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState('');
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch list of surveys on component mount
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await listSurveys();
        setSurveyList(response.data);
      } catch (err) {
        console.error('Failed to fetch surveys:', err);
      }
    };
    fetchSurveys();
  }, []);

  // Fetch selected survey and reset states
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await getSurvey(parseInt(selectedSurveyId));
        if (response?.data) {
          setSurvey(response.data);
          setAnswers([]);
          setCurrentIndex(0);
          setInput('');
          setFinished(false);
          setSubmitted(false);
        }
      } catch (err) {
        console.error('Failed to fetch selected survey:', err);
      }
    };

    if (selectedSurveyId) fetchSurvey();
  }, [selectedSurveyId]);

   // Handle sending a single response to the current question
  const handleSend = () => {
    const question = survey.questions[currentIndex];
    if (!input.trim()) return;

    setAnswers([...answers, { question_id: question.id, answer: input }]);
    setInput('');
    if (currentIndex + 1 >= survey.questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

   // Submit all collected answers to the backend
  const handleSubmit = async () => {
    try {
      await submitResponses({ survey_id: survey.id, answers });
      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to submit survey.');
    }
  };

  // Restart the survey process
  const handleRestart = () => {
    setAnswers([]);
    setInput('');
    setCurrentIndex(0);
    setFinished(false);
    setSubmitted(false);
  };

  return (
    <div className="container mt-5">
      <h4>Take a Survey</h4>

      {/* Survey Dropdown */}
      <div className="mb-4">
        <label>Select a survey:</label>
        <select
          className="form-select"
          value={selectedSurveyId}
          onChange={(e) => setSelectedSurveyId(e.target.value)}
        >
          <option value="">-- Choose Survey --</option>
          {surveyList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <br></br>

      {/* Survey UI */}
      {survey && (
        <>
          <h5>{survey.title}</h5>
          <p>{survey.description}</p>

          {submitted ? (
            <div className="text-center mt-5">
              <h4>🎉 Thank you for completing the survey!</h4>
              <div className="mt-4">
                <button className="btn btn-primary me-2" onClick={handleRestart}>
                  Restart Survey
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="chat-box mb-3 border p-3" style={{ minHeight: '200px' }}>
                {answers.map((a, i) => (
                  <div key={i} className="mb-2">
                    <b>{survey.questions[i].text}</b><br />
                    <span className="text-muted">{a.answer}</span>
                  </div>
                ))}

                {!finished && (
                  <div className="mb-2">
                    <b>{survey.questions[currentIndex].text}</b>
                  </div>
                )}
              </div>

              {!finished ? (
                <>
                  {survey.questions[currentIndex].type === 'mcq' ? (
                    <select
                      className="form-control mb-2"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {survey.questions[currentIndex].options.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : survey.questions[currentIndex].type === 'rating' ? (
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="form-control mb-2"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Rate from 1 to 5"
                    />
                  ) : (
                    <input
                      className="form-control mb-2"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Your answer"
                    />
                  )}
                  <button className="btn btn-primary" disabled={!input} onClick={handleSend}>
                    Send
                  </button>
                </>
              ) : (
                <button className="btn btn-success" onClick={handleSubmit}>
                  Submit All Answers
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TakeSurvey;

