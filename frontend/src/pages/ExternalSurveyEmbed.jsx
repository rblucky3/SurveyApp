import React from 'react';

const ExternalSurveyEmbed = ({ url }) => {
  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <iframe
        src={url}
        title="External Survey"
        style={{ width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
      />


    </div>
  );
};

export default ExternalSurveyEmbed;
