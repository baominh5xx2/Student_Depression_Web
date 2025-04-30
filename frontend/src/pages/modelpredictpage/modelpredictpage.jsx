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

  const [selectedModel, setSelectedModel] = useState('SVM_LIB');
  
  // Add warning message state
  const [timeWarning, setTimeWarning] = useState('');

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    if (name === 'age') {
      // Validate age (0-100 years)
      if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
        setPersonalInfo(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    } else {
      setPersonalInfo(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleHealthInfoChange = (e) => {
    const { name, value } = e.target;
    if (name === 'sleepDuration') {
      // If empty, just update the value
      if (value === '') {
        setHealthInfo(prevState => ({
          ...prevState,
          [name]: value
        }));
        setTimeWarning('');
        return;
      }
      
      const newSleepDuration = parseFloat(value);
      const studyHours = parseFloat(academicInfo.studyHours) || 0;
      
      // Check if new sleep duration is valid
      if (newSleepDuration < 0 || newSleepDuration > 24) {
        return; // Reject invalid sleep duration
      }
      
      // Check if total exceeds 24 hours
      if (newSleepDuration + studyHours > 24) {
        setTimeWarning('Sleep Duration + Study/Work Hours cannot exceed 24 hours in a day. Please reduce one of these values.');
        return; // Don't update state
      }
      
      // Valid input, update state and clear warning
      setHealthInfo(prevState => ({
        ...prevState,
        [name]: value
      }));
      setTimeWarning('');
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
      // If empty, just update the value
      if (value === '') {
        setAcademicInfo(prevState => ({
          ...prevState,
          [name]: value
        }));
        setTimeWarning('');
        return;
      }
      
      const newStudyHours = parseFloat(value);
      const sleepDuration = parseFloat(healthInfo.sleepDuration) || 0;
      
      // Check if new study hours is valid
      if (newStudyHours < 0 || newStudyHours > 24) {
        return; // Reject invalid study hours
      }
      
      // Check if total exceeds 24 hours
      if (newStudyHours + sleepDuration > 24) {
        setTimeWarning('Sleep Duration + Study/Work Hours cannot exceed 24 hours in a day. Current Sleep Duration is ' + sleepDuration + ' hours.');
        return; // Don't update state
      }
      
      // Valid input, update state and clear warning
      setAcademicInfo(prevState => ({
        ...prevState,
        [name]: value
      }));
      setTimeWarning('');
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

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
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
      'Academic_Pressure': Number(academicInfo.academicPressure),
      'Work_Pressure': Number(socialInfo.workPressure),
      'CGPA': Number(academicInfo.gpa),
      'Study_Satisfaction': Number(academicInfo.studySatisfaction),
      'Job_Satisfaction': Number(socialInfo.jobSatisfaction),
      'Sleep_Duration': Number(healthInfo.sleepDuration),
      'Suicidal_Thoughts': Number(healthInfo.suicidalThoughts === "yes"),
      'Work_Study_Hours': Number(academicInfo.studyHours),
      'Financial_Stress': Number(socialInfo.financialStress === "yes"),
      'Family_History_of_Mental_Illness': Number(healthInfo.familyHistory === "yes"),
      'Gender_Male': Number(personalInfo.gender === "male"),
      [`Dietary_Habits_${healthInfo.dietaryHabits === "moderate" ? "Moderate" : 
        healthInfo.dietaryHabits === "unhealthy" ? "Unhealthy" : 
        healthInfo.dietaryHabits === "healthy" ? "Healthy" : "Others"}`]: 1,
      [`Degree_${(() => {
        switch (personalInfo.major) {
          case "bpharm": return "B.Pharm";
          case "bsc": return "BSc";
          case "ba": return "BA";
          case "bca": return "BCA";
          case "mtech": return "M.Tech";
          case "phd": return "PhD";
          case "class_12": return "Class 12";
          case "bed": return "B.Ed";
          case "llb": return "LLB";
          case "be": return "BE";
          case "med": return "M.Ed";
          case "msc": return "MSc";
          case "bhm": return "BHM";
          case "mpharm": return "M.Pharm";
          case "mca": return "MCA";
          case "ma": return "MA";
          case "bcom": return "B.Com";
          case "md": return "MD";
          case "mba": return "MBA";
          case "mbbs": return "MBBS";
          case "mcom": return "M.Com";
          case "barch": return "B.Arch";
          case "llm": return "LLM";
          case "btech": return "B.Tech";
          case "bba": return "BBA";
          case "me": return "ME";
          case "mhm": return "MHM";
          case "others": return "Others";
          default: return "Others";
        }
      })()}`]: 1,
      'Model': selectedModel  // Add the selected model to the input
    };

    console.log("Mapped input:", mappedInput);

    try {
      const result = await predictDepression(mappedInput);
      console.log("Complete prediction API response:", JSON.stringify(result));
      
      // Set prediction result for UI
      setPredictionResult(result.prediction === 1);
      
      // Better error handling for prediction data
      if (result.prediction === undefined || result.prediction === null) {
        console.error("Prediction value is missing in API response");
        throw new Error("Invalid prediction data received");
      }
      
      const prediction = result.prediction;
      
      // Better probability handling
      let probabilities;
      console.log("Raw probability type:", typeof result.probability);
      
      if (Array.isArray(result.probability)) {
        probabilities = result.probability;
      } else if (typeof result.probability === 'object' && result.probability !== null) {
        probabilities = Object.values(result.probability);
      } else if (typeof result.probability === 'number') {
        // Handle case where API returns a single probability value
        probabilities = [1 - result.probability, result.probability];
      } else {
        console.error("Invalid probability format:", result.probability);
        probabilities = [0, 0]; // Fallback
      }
      
      console.log("Formatted data for history API:");
      console.log("- Prediction:", prediction, "Type:", typeof prediction);
      console.log("- Probabilities:", probabilities, "Type:", Array.isArray(probabilities));
      console.log("- Username:", personalInfo.fullName);
      console.log("- Model:", selectedModel);
      
      // Save to history with correct format
      await HistoryService.savePrediction(
        mappedInput,
        prediction,
        probabilities,
        personalInfo.fullName || "Anonymous"
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
    socialInfo,
    selectedModel
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
                min="0"
                max="100"
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
                <option value="bpharm">B.Pharm - Bachelor of Pharmacy</option>
                <option value="bsc">BSc - Bachelor of Science</option>
                <option value="ba">BA - Bachelor of Arts</option>
                <option value="bca">BCA - Bachelor of Computer Applications</option>
                <option value="mtech">M.Tech - Master of Technology</option>
                <option value="phd">PhD - Doctor of Philosophy</option>
                <option value="class_12">Class 12 - 12th Grade</option>
                <option value="bed">B.Ed - Bachelor of Education</option>
                <option value="llb">LLB - Bachelor of Laws</option>
                <option value="be">BE - Bachelor of Engineering</option>
                <option value="med">M.Ed - Master of Education</option>
                <option value="msc">MSc - Master of Science</option>
                <option value="bhm">BHM - Bachelor of Hotel Management</option>
                <option value="mpharm">M.Pharm - Master of Pharmacy</option>
                <option value="mca">MCA - Master of Computer Applications</option>
                <option value="ma">MA - Master of Arts</option>
                <option value="bcom">B.Com - Bachelor of Commerce</option>
                <option value="md">MD - Doctor of Medicine</option>
                <option value="mba">MBA - Master of Business Administration</option>
                <option value="mbbs">MBBS - Bachelor of Medicine and Bachelor of Surgery</option>
                <option value="mcom">M.Com - Master of Commerce</option>
                <option value="barch">B.Arch - Bachelor of Architecture</option>
                <option value="llm">LLM - Master of Laws</option>
                <option value="btech">B.Tech - Bachelor of Technology</option>
                <option value="bba">BBA - Bachelor of Business Administration</option>
                <option value="me">ME - Master of Engineering</option>
                <option value="mhm">MHM - Master of Hotel Management</option>
                <option value="others">Others</option>
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
              {timeWarning && <p className="warning-message" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{timeWarning}</p>}
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
                <option value="healthy">Healthy</option>
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
              {timeWarning && <p className="warning-message" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{timeWarning}</p>}
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

        <div className="section-container">
          <h3>AI Model Prediction</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="aiModel">Select Model:</label>
              <select
                id="aiModel"
                name="aiModel"
                value={selectedModel}
                onChange={handleModelChange}
              >
                <option value="Logictis_LIB">Logictis_LIB</option>
                <option value="Logictis_Scratch">Logictis_Scratch</option>
                <option value="SVM_LIB">SVM_LIB</option>
                <option value="SVM_Scratch">SVM_Scratch</option>
              </select>
            </div>
          </div>
          <p className="model-note">We recommend using SVM_LIB model</p>
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
