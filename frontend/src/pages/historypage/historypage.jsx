import React, { useState, useEffect } from 'react';
import './historypage.css';
import Sidebar from '../../components/siderbar/siderbar';
import { HistoryService } from '../../services/history';

function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch history data from API
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const data = await HistoryService.getHistory(20); // Get up to 20 records
        
        // Process data to match our expected format
        const processedData = data.map(item => {
          // Extract info from input_data or use defaults
          const personalInfo = item.input_data?.personalInfo || {};
          const healthInfo = item.input_data?.healthInfo || {};
          const academicInfo = item.input_data?.academicInfo || {};
          const socialInfo = item.input_data?.socialInfo || {};
          
          return {
            id: item._id,
            date: new Date(item.timestamp).toLocaleDateString(),
            personalInfo: {
              fullName: item.user_name || personalInfo.fullName || "Unknown",
              age: personalInfo.age || "N/A",
              gender: personalInfo.gender || "N/A",
              major: personalInfo.major || "N/A"
            },
            healthInfo: {
              sleepDuration: healthInfo.sleepDuration || "N/A",
              dietaryHabits: healthInfo.dietaryHabits || "N/A",
              suicidalThoughts: healthInfo.suicidalThoughts || "N/A",
              familyHistory: healthInfo.familyHistory || "N/A"
            },
            academicInfo: {
              academicPressure: academicInfo.academicPressure || "N/A",
              studySatisfaction: academicInfo.studySatisfaction || "N/A",
              studyHours: academicInfo.studyHours || "N/A",
              gpa: academicInfo.gpa || "N/A"
            },
            socialInfo: {
              jobSatisfaction: socialInfo.jobSatisfaction || "N/A",
              financialStress: socialInfo.financialStress || "N/A",
              workPressure: socialInfo.workPressure || "N/A"
            },
            result: item.prediction === 1 // True if prediction is 1 (depressed)
          };
        });
        
        setHistoryData(processedData);
        setFilteredData(processedData);
      } catch (error) {
        console.error("Error fetching history:", error);
        setHistoryData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistoryData();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredData(historyData);
    } else {
      const filtered = historyData.filter(item => 
        item.personalInfo.fullName.toLowerCase().includes(query) ||
        item.date.includes(query) ||
        item.personalInfo.major.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
    }
  };

  // View details of a record
  const viewDetails = (id) => {
    console.log("View details for ID:", id);
    // In a real app, this would open a modal or navigate to a details page
    alert(`View details for record #${id}`);
  };

  return (
    <div className="history-page">
      <Sidebar />
      <div className="history-content">
        <div className="search-container">
          <h1>Assessment History</h1>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search by name, date, or major..." 
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className="search-button">Search</button>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading">Loading history data...</div>
          ) : filteredData.length === 0 ? (
            <div className="no-records">No records found matching your search.</div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Major</th>
                  <th>Sleep</th>
                  <th>GPA</th>
                  <th>Academic Pressure</th>
                  <th>Financial Stress</th>
                  <th>Assessment Result</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(record => (
                  <tr key={record.id} className={record.result ? "depressed" : ""}>
                    <td>{record.date}</td>
                    <td>{record.personalInfo.fullName}</td>
                    <td>{record.personalInfo.age}</td>
                    <td>{record.personalInfo.gender}</td>
                    <td>{record.personalInfo.major}</td>
                    <td>{record.healthInfo.sleepDuration} hrs</td>
                    <td>{record.academicInfo.gpa}</td>
                    <td>{record.academicInfo.academicPressure}/5</td>
                    <td>{record.socialInfo.financialStress}</td>
                    <td className={`result ${record.result ? "depressed" : "not-depressed"}`}>
                      {record.result ? 
                        <span>Depression Risk</span> : 
                        <span>No Depression Risk</span>
                      }
                    </td>
                    <td>
                      <button 
                        className="view-details-btn"
                        onClick={() => viewDetails(record.id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryPage; 