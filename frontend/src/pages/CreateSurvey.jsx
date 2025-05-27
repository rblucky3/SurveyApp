// src/pages/CreateSurvey.jsx

// src/pages/CreateSurvey.jsx
import React, { useState } from 'react';
import { createSurvey } from '../api/surveyApi'; // API function to create a survey

const CreateSurvey = () => {
  // State declaration
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);

  // Add a new question with default structure
  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'text', options: [] }]);
  };

  // Update question properties (text, type)
  const updateQuestion = (i, key, value) => {
    const updated = [...questions];
    updated[i][key] = value;

    // Clear options if type is not MCQ
    if (key === 'type' && value !== 'mcq') updated[i].options = [];

    setQuestions(updated);
  };

  // Update multiple choice options
  const updateOption = (i, options) => {
    const updated = [...questions];
    updated[i].options = options;
    setQuestions(updated);
  };

  // Submit survey to backend
  const submitSurvey = async () => {
    try {
      await createSurvey({ title, description, questions }); // API call
      alert('Survey created!');

      // Reset form fields
      setTitle('');
      setDescription('');
      setQuestions([]);
    } catch (error) {
      console.error('Error creating survey:', error);
      alert('Failed to create survey.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Survey</h2>

      <input
        className="form-control my-2"
        placeholder="Survey Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        className="form-control my-2"
        placeholder="Survey Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button className="btn btn-secondary mb-3" onClick={addQuestion}>
        Add Question
      </button>

      {/* Render each question input card */}
      {questions.map((q, i) => (
        <div key={i} className="card p-3 mb-2">
          <input
            className="form-control mb-2"
            placeholder="Question text"
            value={q.text}
            onChange={e => updateQuestion(i, 'text', e.target.value)}
          />

          <select
            className="form-control mb-2"
            value={q.type}
            onChange={e => updateQuestion(i, 'type', e.target.value)}
          >
            <option value="text">Text</option>
            <option value="mcq">Multiple Choice</option>
            <option value="rating">Rating</option>
          </select>

          {/* Input for MCQ options */}
          {q.type === 'mcq' && (
            <input
              className="form-control"
              placeholder="Comma-separated options"
              onChange={e => updateOption(i, e.target.value.split(',').map(s => s.trim()))}
            />
          )}
        </div>
      ))}

      <br />
      <hr />
      <br />

      <button className="btn btn-primary mt-3" onClick={submitSurvey}>
        Submit Survey
      </button>
    </div>
  );
};

export default CreateSurvey;



/*


import React, { useState } from 'react';
import axios from 'axios';
import { createSurvey } from '../api/surveyApi';


const CreateSurvey = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'text', options: [] }]);
  };

  const updateQuestion = (i, key, value) => {
    const updated = [...questions];
    updated[i][key] = value;
    if (key === 'type' && value !== 'mcq') updated[i].options = [];
    setQuestions(updated);
  };

  const updateOption = (i, options) => {
    const updated = [...questions];
    updated[i].options = options;
    setQuestions(updated);
  };

 const submitSurvey = async () => {
    try {
      await createSurvey({ title, description, questions });
      alert('Survey created!');
      setTitle('');
      setDescription('');
      setQuestions([]);
    } catch (error) {
      console.error('Error creating survey:', error);
      alert('Failed to create survey.');
    }
  };


  return (
    <div className="container mt-4">
      <h2>Create Survey</h2>
      <input className="form-control my-2" placeholder="Survey Title" onChange={e => setTitle(e.target.value)} />
      <textarea className="form-control my-2" placeholder="Survey Description" onChange={e => setDescription(e.target.value)} />
      <button className="btn btn-secondary mb-3" onClick={addQuestion}>Add Question</button>

      {questions.map((q, i) => (
        <div key={i} className="card p-3 mb-2">
          <input className="form-control mb-2" placeholder="Question text" value={q.text} onChange={e => updateQuestion(i, 'text', e.target.value)} />
          <select className="form-control mb-2" value={q.type} onChange={e => updateQuestion(i, 'type', e.target.value)}>
            <option value="text">Text</option>
            <option value="mcq">Multiple Choice</option>
            <option value="rating">Rating</option>
          </select>
          {q.type === 'mcq' && (
            <input className="form-control" placeholder="Comma-separated options"
              onChange={e => updateOption(i, e.target.value.split(',').map(s => s.trim()))} />
          )}
        </div>
      ))}
<br></br>
<hr></hr>
<br></br>
      <button className="btn btn-primary mt-3" onClick={submitSurvey}>Submit Survey</button>
    </div>
  );
};

export default CreateSurvey;


*/


