// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="text-light text-center py-3 mt-auto" style={{background:'#0d6efd'}}>
      <div className="container">
        <span>© {new Date().getFullYear()} SurveyApp. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
