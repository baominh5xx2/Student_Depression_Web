import React, { useState, useEffect } from 'react';
import './historypage.css';
import Sidebar from '../../components/siderbar/siderbar';

function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch history data (mock data for now)
  useEffect(() => {
    // This would be replaced with an actual API call
    const mockData = [
      {
        id: 1,
        date: "2023-06-15",
        personalInfo: {
          fullName: "John Doe",
          age: "22",
          gender: "male",
          major: "Bachelor of Computer Applications"
        },
        healthInfo: {
          sleepDuration: "7",
          dietaryHabits: "yes",
          suicidalThoughts: "no",
          familyHistory: "no"
        },
        academicInfo: {
          academicPressure: "3",
          studySatisfaction: "4",
          studyHours: "6",
          gpa: "8.5"
        },
        socialInfo: {
          jobSatisfaction: "3",
          financialStress: "no",
          workPressure: "2"
        },
        result: false // Not depressed
      },
      {
        id: 2,
        date: "2023-06-20",
        personalInfo: {
          fullName: "Jane Smith",
          age: "20",
          gender: "female",
          major: "Bachelor of Architecture"
        },
        healthInfo: {
          sleepDuration: "5",
          dietaryHabits: "no",
          suicidalThoughts: "yes",
          familyHistory: "yes"
        },
        academicInfo: {
          academicPressure: "5",
          studySatisfaction: "2",
          studyHours: "10",
          gpa: "7.2"
        },
        socialInfo: {
          jobSatisfaction: "1",
          financialStress: "yes",
          workPressure: "4"
        },
        result: true // Depressed
      },
      {
        id: 3,
        date: "2023-07-05",
        personalInfo: {
          fullName: "Alex Johnson",
          age: "25",
          gender: "male",
          major: "Bachelor of Commerce"
        },
        healthInfo: {
          sleepDuration: "8",
          dietaryHabits: "yes",
          suicidalThoughts: "no",
          familyHistory: "yes"
        },
        academicInfo: {
          academicPressure: "2",
          studySatisfaction: "4",
          studyHours: "5",
          gpa: "8.0"
        },
        socialInfo: {
          jobSatisfaction: "3",
          financialStress: "no",
          workPressure: "2"
        },
        result: false // Not depressed
      }
    ];

    setTimeout(() => {
      setHistoryData(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 800); // Simulate loading time
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