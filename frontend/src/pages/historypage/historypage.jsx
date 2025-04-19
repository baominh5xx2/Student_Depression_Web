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
          // Extract basic info from input_data
          const inputData = item.input_data || {};
          
          // Decode gender from one-hot encoding
          let gender = "N/A";
          if (inputData['Gender_Male'] === 1) gender = "Male";
          else if (inputData['Gender_Female'] === 1) gender = "Female";
          
          // Decode dietary habits
          let dietaryHabits = "N/A";
          if (inputData['Dietary Habits_Moderate'] === 1) dietaryHabits = "Moderate";
          else if (inputData['Dietary Habits_Unhealthy'] === 1) dietaryHabits = "Unhealthy";
          else if (inputData['Dietary Habits_Others'] === 1) dietaryHabits = "Others";
          
          // Decode degree/major
          let major = "N/A";
          if (inputData['Degree_B.Ed'] === 1) major = "Bachelor of Education";
          else if (inputData['Degree_B.Com'] === 1) major = "Bachelor of Commerce";
          else if (inputData['Degree_B.Arch'] === 1) major = "Bachelor of Architecture";
          else if (inputData['Degree_BCA'] === 1) major = "Bachelor of Computer Applications";
          else if (inputData['Degree_Class12'] === 1) major = "Class 12";
          
          // Decode yes/no fields
          const suicidalThoughts = inputData['Suicidal_Thoughts'] === 1 ? "Yes" : "No";
          const financialStress = inputData['Financial Stress'] === 1 ? "Yes" : "No";
          const familyHistory = inputData['Family History of Mental Illness'] === 1 ? "Yes" : "No";
          
          return {
            id: item._id,
            date: new Date(item.timestamp).toLocaleDateString(),
            personalInfo: {
              fullName: item.user_name || "Unknown",
              age: inputData['Age'] || "N/A",
              gender: gender,
              major: major
            },
            healthInfo: {
              sleepDuration: inputData['Sleep Duration'] || "N/A",
              dietaryHabits: dietaryHabits,
              suicidalThoughts: suicidalThoughts,
              familyHistory: familyHistory
            },
            academicInfo: {
              academicPressure: inputData['Academic Pressure'] || "N/A",
              studySatisfaction: inputData['Study Satisfaction'] || "N/A",
              studyHours: inputData['Work/Study Hours'] || "N/A",
              gpa: inputData['CGPA'] || "N/A"
            },
            socialInfo: {
              jobSatisfaction: inputData['Job Satisfaction'] || "N/A",
              financialStress: financialStress,
              workPressure: inputData['Work Pressure'] || "N/A"
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
                  <th>Dietary Habits</th>
                  <th>Suicidal Thoughts</th>
                  <th>Family History</th>
                  <th>GPA</th>
                  <th>Academic Pressure</th>
                  <th>Study Satisfaction</th>
                  <th>Study Hours</th>
                  <th>Job Satisfaction</th>
                  <th>Financial Stress</th>
                  <th>Work Pressure</th>
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
                    <td>{record.healthInfo.dietaryHabits}</td>
                    <td>{record.healthInfo.suicidalThoughts}</td>
                    <td>{record.healthInfo.familyHistory}</td>
                    <td>{record.academicInfo.gpa}</td>
                    <td>{record.academicInfo.academicPressure}/5</td>
                    <td>{record.academicInfo.studySatisfaction}/5</td>
                    <td>{record.academicInfo.studyHours} hrs</td>
                    <td>{record.socialInfo.jobSatisfaction}/5</td>
                    <td>{record.socialInfo.financialStress}</td>
                    <td>{record.socialInfo.workPressure}/5</td>
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