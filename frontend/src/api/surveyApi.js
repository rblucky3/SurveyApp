import axios from 'axios';

// Initialize Axios instance with base API URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});


// Auth APIs
export const register = (data) => API.post('/auth/register', data);  // Register new user
export const login = (data) => API.post('/auth/login', data);        // User login
export const getTeams = () => API.get('/auth/teams');                // Fetch all teams
export const createTeam = (data) => API.post('/teams', data);        // Create a new team


// Survey APIs
export const createSurvey = (data) => API.post('/surveys', data);        // Create a new survey
export const getSurvey = (id) => API.get(`/survey/${id}`);               // Get a survey by ID
export const listSurveys = () => API.get('/responses/surveys');          // List all surveys


// Survey Response APIs
export const submitResponses = (data) => API.post('/responses', data);   // Submit in-app survey responses
export const getSummaryResponses = (surveyId) =>                         // Get response summary for charts
  API.get(`/responses/responses-summary?survey_id=${surveyId}`);


// Survey Distribution
export const sendSurveyEmail = (data) => API.post('/surveys/distribute', data);  // Send survey link via email


// Upload CSV responses
export const uploadSurveyResponsesCSV = (surveyId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  return API.post(`/responses/upload-csv?survey_id=${surveyId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};







/*


import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getTeams = () => API.get('/auth/teams');
export const createTeam = (data) => API.post('/teams', data);
export const createSurvey = (data) => API.post('/surveys', data);
export const getSurvey = (id) => API.get(`/survey/${id}`);
export const submitResponses = (data) => API.post('/responses', data);

//export const getSummaryResponses = (data) => API.get('/responses/responses-summary/${survey_id}', data);
export const listSurveys = (data) => API.get(`/responses/surveys`, data);
export const getSummaryResponses = (surveyId) =>API.get('/responses/responses-summary?survey_id=${surveyId}');
export const sendSurveyEmail = (data) => API.post('/surveys/distribute', data);

export const uploadSurveyResponsesCSV = (surveyId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  return API.post(`/responses/upload-csv?survey_id=${surveyId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


*/