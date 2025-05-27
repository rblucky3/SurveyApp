import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import CreateSurvey from './pages/CreateSurvey';
import Dashboard from './pages/Dashboard';
import TakeSurvey from './pages/TakeSurvey';
import Register from './pages/RegisterPage';
import Login from './pages/LoginPage';
import CreateTeam from './pages/CreateTeam';
import DistributeSurvey  from './pages/DistributeSurvey';
import UploadSurveyCSV from './components/UploadSurveyCSV';
import Footer from './components/Footer';

export default function App() {
 const layoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const contentStyle = {
    flex: 1,
  };


  return (
    <div style={layoutStyle}>
      <Router>
      <Navbar />
      <div className="container mt-4" style={contentStyle}>
        <Routes>
          <Route path="/create" element={<CreateSurvey />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/survey" element={<TakeSurvey />} />
          <Route path="/distribute" element={<DistributeSurvey />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/team" element={<CreateTeam />} />
          <Route path="/public-survey/upload-csv" element={<UploadSurveyCSV />} />

        </Routes>
        
      </div>
      <br></br>
      <Footer />
    </Router>
    </div>
    
  );
}
