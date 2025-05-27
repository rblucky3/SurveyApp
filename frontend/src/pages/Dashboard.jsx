import React, { useEffect, useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';


//import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import axios from 'axios';
import {getSummaryResponses,listSurveys } from '../api/surveyApi';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      const res = await listSurveys();
      setSurveys(res.data);
    };
    fetchSurveys();
  }, []);

  // Fetch summary response data when a survey is selected
  useEffect(() => {
    const fetchSummary = async () => {
      if (!selectedSurvey){
        //setSummary([]); // Clear data if nothing is selected
        return;
      } 
      const res = await getSummaryResponses(parseInt(selectedSurvey,10))
      setSummary(res.data);
    };
    fetchSummary();
  }, [selectedSurvey]);


   // Group summary data by question -> answer -> count
  const groupByQuestion = () => {
    const grouped = {};
    summary.forEach(({ question, answer, count }) => {
      if (!grouped[question]) grouped[question] = {};
      grouped[question][answer] = count;
    });
    return grouped;
  };

  const groupedData = groupByQuestion();
  const firstQuestion = Object.keys(groupedData)[0];

   // Pie chart data for the first question
  const pieChartData = firstQuestion ? {
    labels: Object.keys(groupedData[firstQuestion]),
    datasets: [{
      data: Object.values(groupedData[firstQuestion]),
      backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6610f2']
    }]
  } : null;

  // Bar chart data: show grouped bars per question
  const barChartData = {
    labels: Object.keys(groupedData),
    datasets: Object.entries(groupedData).flatMap(([question, answers]) => ({
      label: question,
      data: Object.values(answers),
      backgroundColor: '#007bff'
    }))
  };

  // Line chart data: show total response count per question
  const lineChartData = {
    labels: Object.keys(groupedData),
    datasets: [{
      label: 'Responses per Question',
      data: Object.values(groupedData).map(obj => Object.values(obj).reduce((a, b) => a + b, 0)),
      fill: false,
      borderColor: '#28a745',
      tension: 0.1
    }]
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Survey Dashboard</h2>

      <div className="form-group mb-4">
        <label>Select Survey:</label>
        <select className="form-control" onChange={e => setSelectedSurvey(e.target.value)} value={selectedSurvey}>
          <option value="">-- Choose a survey --</option>
          {surveys.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </div>

      {/* Display message when no data is available */}
      {summary.length === 0 ? (
        <p>No data to display. Select a survey.</p>
      ) : (
        <>
          <div className="row">

            {/* Pie chart for first question */}
            <div className="col-md-6 mb-4">
              <h5>Pie Chart: {firstQuestion}</h5>
              {pieChartData ? <Pie data={pieChartData} /> : <p>No data</p>}
            </div>

            {/* Bar chart for all questions */}
            <div className="col-md-6 mb-4">
              <h5>Bar Chart</h5>
              <Bar data={barChartData} />
            </div>

            {/* Line chart showing total responses per question */}
            <div className="col-md-12 mb-4">
              <h5>Line Chart</h5>
              <Line data={lineChartData} />
            </div>
          </div>

          {/* Tabular summary of all question-answer counts */}
          <h5 className="mt-4">Responses Summary</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.question}</td>
                    <td>{row.answer}</td>
                    <td>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;



