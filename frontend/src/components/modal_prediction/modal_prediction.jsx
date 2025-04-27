import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import './modal_prediction.css';

function ModalPrediction({ open, handleClose, formData, predictionResult }) {
  // Use only the real prediction result from the API
  const isDepressed = predictionResult === true;
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      className="prediction-modal"
    >
      <DialogTitle>
        <Typography variant="h5" component="div" fontWeight="bold">
          Depression Risk Assessment Results
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <div className="modal-content-container">
          {/* Left column: User data table */}
          <div className="user-data-column">
            <Typography variant="h6" gutterBottom>
              Your Information
            </Typography>
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableBody>
                  {/* Personal Information */}
                  <TableRow>
                    <TableCell colSpan={2} className="section-header">
                      Personal Information
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    <TableCell>{formData?.personalInfo?.fullName || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Age</TableCell>
                    <TableCell>{formData?.personalInfo?.age || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gender</TableCell>
                    <TableCell>{formData?.personalInfo?.gender === "male" ? "Male" : 
                                formData?.personalInfo?.gender === "female" ? "Female" : "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Major</TableCell>
                    <TableCell>{(() => {
                      const major = formData?.personalInfo?.major;
                      switch(major) {
                        case "bachelor_education": return "Bachelor of Education";
                        case "bachelor_commerce": return "Bachelor of Commerce";
                        case "bachelor_architecture": return "Bachelor of Architecture";
                        case "bachelor_computer": return "Bachelor of Computer Applications";
                        case "class_12": return "Class 12";
                        default: return major || "-";
                      }
                    })()}</TableCell>
                  </TableRow>

                  {/* Health Information */}
                  <TableRow>
                    <TableCell colSpan={2} className="section-header">
                      Health Information
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sleep Duration</TableCell>
                    <TableCell>{formData?.healthInfo?.sleepDuration || "-"} hours</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dietary Habits</TableCell>
                    <TableCell>{(() => {
                      const habits = formData?.healthInfo?.dietaryHabits;
                      return habits ? habits.charAt(0).toUpperCase() + habits.slice(1) : "-";
                    })()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Suicidal Thoughts</TableCell>
                    <TableCell>{(() => {
                      const thoughts = formData?.healthInfo?.suicidalThoughts;
                      return thoughts ? thoughts.charAt(0).toUpperCase() + thoughts.slice(1) : "-";
                    })()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Family History of Mental Illness</TableCell>
                    <TableCell>{(() => {
                      const history = formData?.healthInfo?.familyHistory;
                      return history ? history.charAt(0).toUpperCase() + history.slice(1) : "-";
                    })()}</TableCell>
                  </TableRow>

                  {/* Academic Information */}
                  <TableRow>
                    <TableCell colSpan={2} className="section-header">
                      Academic Information
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Academic Pressure</TableCell>
                    <TableCell>{formData?.academicInfo?.academicPressure || "-"}/5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Study Satisfaction</TableCell>
                    <TableCell>{formData?.academicInfo?.studySatisfaction || "-"}/5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Study/Work Hours</TableCell>
                    <TableCell>{formData?.academicInfo?.studyHours || "-"} hours</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GPA</TableCell>
                    <TableCell>{formData?.academicInfo?.gpa || "-"}/10</TableCell>
                  </TableRow>

                  {/* Social Information */}
                  <TableRow>
                    <TableCell colSpan={2} className="section-header">
                      Social Information
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Job Satisfaction</TableCell>
                    <TableCell>{formData?.socialInfo?.jobSatisfaction || "-"}/4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Financial Stress</TableCell>
                    <TableCell>{(() => {
                      const stress = formData?.socialInfo?.financialStress;
                      return stress ? stress.charAt(0).toUpperCase() + stress.slice(1) : "-";
                    })()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Work Pressure</TableCell>
                    <TableCell>{formData?.socialInfo?.workPressure || "-"}/5</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Right column: Prediction result */}
          <div className="assessment-result-column">
            <div className={`result-container ${isDepressed ? 'depression-positive' : 'depression-negative'}`}>
              <h3 className="result-title">Assessment Result</h3>
              
              <div className="result-icon">
                {isDepressed ? (
                  <CancelIcon className="icon-error" />
                ) : (
                  <CheckCircleIcon className="icon-success" />
                )}
              </div>

              <h2 className={`result-heading ${isDepressed ? 'error-text' : 'success-text'}`}>
                {isDepressed ? 'Depression Risk Detected' : 'No Depression Risk Detected'}
              </h2>
              
              <p className="result-description">
                {isDepressed 
                  ? 'Based on the information provided, our system has detected signs of depression. We strongly recommend consulting with a mental health professional for a proper diagnosis and support.'
                  : 'Based on the information provided, our system has not detected signs of depression. However, if you\'re feeling unwell, consider speaking with a healthcare professional.'}
              </p>
              
              <p className="result-disclaimer">
                Disclaimer: This is not a medical diagnosis. Results are based on provided information and
                should be discussed with a healthcare professional.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" className="close-button">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalPrediction;
