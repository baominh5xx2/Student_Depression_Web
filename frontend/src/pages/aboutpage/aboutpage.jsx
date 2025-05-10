import React from 'react';
import Sidebar from '../../components/siderbar/siderbar';
import './aboutpage.css';

function AboutPage() {
  // Placeholder team data - to be filled in later
  const teamMembers = [
    {
      id: 1, 
      name: "Nguyễn Minh Bảo",
      studentId: "23520123",
      role: "Team Leader"
    },
    {
      id: 2,
      name: "Nguyễn Quốc Vinh",
      studentId: "22521674",
      role: ""
    },
    {
      id: 3,
      name: "Lê Nguyễn Quốc Bảo",
      studentId: "23520108",
      role: ""
    },
    {
      id: 4,
      name: "Huỳnh Thái Bảo",
      studentId: "23520105",
      role: ""
    }
  ];

  return (
    <div className="aboutpage-container">
      <Sidebar />
      <div className="aboutpage-content">
        <div className="about-main-content">
          <div className="about-text">
            We are a team of Computer Science students passionate about using technology for social good. 
            Our project focuses on detecting signs of depression in students, aiming to support mental health 
            awareness in education. Through this, we hope to contribute to a more compassionate and informed community.
          </div>
          
          <div className="team-section">
            <h2 className="team-heading">Project Team</h2>
            <div className="team-members">
              {teamMembers.map(member => (
                <div key={member.id} className="team-member-card">
                  <h3 className="member-name">{member.name}</h3>
                  <div className="member-id">{member.studentId}</div>
                  {member.role && <p className="member-role">{member.role}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
