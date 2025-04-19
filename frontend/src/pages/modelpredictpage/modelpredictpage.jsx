import React, { useState } from 'react';
import './modelpredictpage.css';
import Sidebar from '../../components/siderbar/siderbar';
import ModalPrediction from '../../components/modal_prediction/modal_prediction';
import { Button } from '@mui/material';
import { predictDepression } from "../../services/prediction";
import { HistoryService } from "../../services/history"; // Thêm dòng này

function ModelPredictPage() {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    age: '',
    gender: '',
    major: ''
  });

  const [healthInfo, setHealthInfo] = useState({
    sleepDuration: '',
    dietaryHabits: '',
    suicidalThoughts: '',
    familyHistory: ''
  });

  const [academicInfo, setAcademicInfo] = useState({
    academicPressure: '',
    studySatisfaction: '',
    studyHours: '',
    gpa: ''
  });

  const [socialInfo, setSocialInfo] = useState({
    jobSatisfaction: '',
    financialStress: '',
    workPressure: ''
  });

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleHealthInfoChange = (e) => {
    const { name, value } = e.target;
    if (name === 'sleepDuration') {
      // Validate sleep duration (0-24 hours)
      if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 24)) {
        setHealthInfo(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    } else {
      setHealthInfo(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleAcademicInfoChange = (e) => {
    const { name, value } = e.target;
    if (name === 'studyHours') {
      if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 24)) {
        setAcademicInfo(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    } else if (name === 'gpa') {
      if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
        setAcademicInfo(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    } else {
      setAcademicInfo(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSocialInfoChange = (e) => {
    const { name, value } = e.target;
    setSocialInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Generate options for ratings 0-5
  const ratingOptions = Array.from({ length: 6 }, (_, i) => (
    <option key={i} value={i}>{i}</option>
  ));

  // Generate options for ratings 0-4
  const satisfactionOptions = Array.from({ length: 5 }, (_, i) => (
    <option key={i} value={i}>{i}</option>
  ));

  // Handle form submission and show modal
  const handleSubmit = async () => {
    // Format payload with correct key names
    const mappedInput = {
      'Age': Number(personalInfo.age),
      'Academic Pressure': Number(academicInfo.academicPressure),
      'Work Pressure': Number(socialInfo.workPressure),
      'CGPA': Number(academicInfo.gpa),
      'Study Satisfaction': Number(academicInfo.studySatisfaction),
      'Job Satisfaction': Number(socialInfo.jobSatisfaction),
      'Sleep Duration': Number(healthInfo.sleepDuration),
      'Suicidal_Thoughts': Number(healthInfo.suicidalThoughts === "yes"),
      'Work/Study Hours': Number(academicInfo.studyHours),
      'Financial Stress': Number(socialInfo.financialStress === "yes"),
      'Family History of Mental Illness': Number(healthInfo.familyHistory === "yes"),
      'Gender_Male': Number(personalInfo.gender === "male"),
      'Gender_Female': Number(personalInfo.gender === "female"),
      'Profession_Student': 1,
      [`Dietary Habits_${healthInfo.dietaryHabits === "moderate" ? "Moderate" : 
        healthInfo.dietaryHabits === "unhealthy" ? "Unhealthy" : "Others"}`]: 1,
      [`Degree_${(() => {
        switch (personalInfo.major) {
          case "bachelor_education": return "B.Ed";
          case "bachelor_commerce": return "B.Com";
          case "bachelor_architecture": return "B.Arch";
          case "bachelor_computer": return "BCA";
          case "class_12": return "Class12";
          default: return "BCA";
        }
      })()}`]: 1
    };

    console.log("Mapped input:", mappedInput);

    try {
      const result = await predictDepression(mappedInput);
      console.log("Prediction result:", result);
      console.log("Raw probability from API:", result.probability); // In ra để debug

      // Set prediction result for UI
      setPredictionResult(result.prediction === 1);
      
      // Lấy đúng dữ liệu từ kết quả API
      const prediction = result.prediction;
      // Kiểm tra cấu trúc dữ liệu để lấy đúng mảng probability
      let probabilities;
      if (Array.isArray(result.probability)) {
        probabilities = result.probability;
      } else if (typeof result.probability === 'object' && result.probability !== null) {
        // Nếu là object, thử chuyển thành array
        probabilities = Object.values(result.probability);
      } else {
        // Fallback
        probabilities = [0, 0];
      }
      
      console.log(`Sending to history API - Prediction: ${prediction}, Probabilities:`, probabilities);
      
      // Save to history with correct format
      await HistoryService.savePrediction(
        mappedInput,
        prediction,
        probabilities,
        personalInfo.fullName
      );
      
      setOpenModal(true);
    } catch (error) {
      console.error("Error in prediction or saving history:", error);
      alert("Prediction failed: " + error.message);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Combine all form data for the modal
  const allFormData = {
    personalInfo,
    healthInfo,
    academicInfo,
    socialInfo
  };

  return (
    <div className="model-predict-page">
      <Sidebar />
      <div className="content-area">
        <div className="section-container">
          <h3>Section 1: Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={personalInfo.fullName}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={personalInfo.age}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={personalInfo.gender}
                onChange={handlePersonalInfoChange}
              >
                <option value=""></option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="major">Major:</label>
              <select
                id="major"
                name="major"
                value={personalInfo.major}
                onChange={handlePersonalInfoChange}
              >
                <option value=""></option>
                <option value="bachelor_education">Bachelor of Education</option>
                <option value="bachelor_commerce">Bachelor of Commerce</option>
                <option value="bachelor_architecture">Bachelor of Architecture</option>
                <option value="bachelor_computer">Bachelor of Computer Applications</option>
                <option value="class_12">Class 12</option>
              </select>
            </div>
          </div>
        </div>

        <div className="section-container">
          <h3>Section 2: Health Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sleepDuration">Sleep Duration (hours):</label>
              <input
                type="number"
                id="sleepDuration"
                name="sleepDuration"
                value={healthInfo.sleepDuration}
                onChange={handleHealthInfoChange}
                min="0"
                max="24"
                step="0.5"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dietaryHabits">Dietary Habits:</label>
              <select
                id="dietaryHabits"
                name="dietaryHabits"
                value={healthInfo.dietaryHabits}
                onChange={handleHealthInfoChange}
              >
                <option value=""></option>
                <option value="moderate">Moderate</option>
                <option value="unhealthy">Unhealthy</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="suicidalThoughts">Suicidal Thoughts:</label>
              <select
                id="suicidalThoughts"
                name="suicidalThoughts"
                value={healthInfo.suicidalThoughts}
                onChange={handleHealthInfoChange}
              >
                <option value=""></option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="familyHistory">Family History of Mental Illness:</label>
              <select
                id="familyHistory"
                name="familyHistory"
                value={healthInfo.familyHistory}
                onChange={handleHealthInfoChange}
              >
                <option value=""></option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>

        <div className="section-container">
          <h3>Section 3: Academic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="academicPressure">Academic Pressure:</label>
              <select
                id="academicPressure"
                name="academicPressure"
                value={academicInfo.academicPressure}
                onChange={handleAcademicInfoChange}
              >
                <option value=""></option>
                {ratingOptions}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="studySatisfaction">Study Satisfaction:</label>
              <select
                id="studySatisfaction"
                name="studySatisfaction"
                value={academicInfo.studySatisfaction}
                onChange={handleAcademicInfoChange}
              >
                <option value=""></option>
                {ratingOptions}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="studyHours">Study/Work Hours:</label>
              <input
                type="number"
                id="studyHours"
                name="studyHours"
                value={academicInfo.studyHours}
                onChange={handleAcademicInfoChange}
                min="0"
                max="24"
                step="0.5"
              />
            </div>
            <div className="form-group">
              <label htmlFor="gpa">GPA:</label>
              <input
                type="number"
                id="gpa"
                name="gpa"
                value={academicInfo.gpa}
                onChange={handleAcademicInfoChange}
                min="0"
                max="10"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="section-container">
          <h3>Section 4: Social Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="jobSatisfaction">Job Satisfaction:</label>
              <select
                id="jobSatisfaction"
                name="jobSatisfaction"
                value={socialInfo.jobSatisfaction}
                onChange={handleSocialInfoChange}
              >
                <option value=""></option>
                {satisfactionOptions}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="financialStress">Financial Stress:</label>
              <select
                id="financialStress"
                name="financialStress"
                value={socialInfo.financialStress}
                onChange={handleSocialInfoChange}
              >
                <option value=""></option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="workPressure">Work Pressure:</label>
              <select
                id="workPressure"
                name="workPressure"
                value={socialInfo.workPressure}
                onChange={handleSocialInfoChange}
              >
                <option value=""></option>
                {ratingOptions}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-container">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            size="large"
          >
            Submit for Assessment
          </Button>
        </div>

        {/* Prediction Modal */}
        <ModalPrediction
          open={openModal}
          handleClose={handleCloseModal}
          formData={allFormData}
          predictionResult={predictionResult}
        />
      </div>
    </div>
  );
}

export default ModelPredictPage;
