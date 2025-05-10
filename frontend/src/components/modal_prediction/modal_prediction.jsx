import React, { useState, useEffect } from 'react';
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
  Paper,
  Box,
  Divider,
  CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import './modal_prediction.css';
import GeminiService from '../../services/geminiService';

function ModalPrediction({ open, handleClose, formData, predictionResult }) {
  // Use only the real prediction result from the API
  const isDepressed = predictionResult === true;
  
  // State for LLM-generated advice
  const [llmAdvice, setLlmAdvice] = useState('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  
  // Fetch advice from Gemini API when modal opens
  useEffect(() => {
    // Only fetch if the modal is open and we have formData
    if (open && formData) {
      const getAdviceFromLLM = async () => {
        setIsLoadingAdvice(true);
        try {
          const advice = await GeminiService.getAdvice({ formData, predictionResult });
          setLlmAdvice(advice);
        } catch (error) {
          console.error('Failed to get advice from Gemini:', error);
          // Fallback message
          setLlmAdvice(isDepressed 
            ? 'Based on the information provided, our system has detected signs of depression. We strongly recommend consulting with a mental health professional for a proper diagnosis and support.'
            : 'Based on the information provided, our system has not detected signs of depression. However, if you\'re feeling unwell, consider speaking with a healthcare professional.');
        } finally {
          setIsLoadingAdvice(false);
        }
      };

      getAdviceFromLLM();
    }
  }, [open, formData, predictionResult, isDepressed]);
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      className="prediction-modal"
    >
      <DialogTitle className="modal-title">
        <Typography variant="h5" component="div" fontWeight="bold">
          Depression Risk Assessment Results
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {/* Results section at the top */}
        <Box className="result-banner" sx={{ mb: 4 }}>
          <div className={`result-container ${isDepressed ? 'depression-positive' : 'depression-negative'}`}>
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
            
            <div className="advice-container">
              {isLoadingAdvice ? (
                <div className="loading-advice">
                  <CircularProgress size={24} color="inherit" />
                  <p>Generating personalized advice based on your information...</p>
                </div>
              ) : (
                <div className="result-description">
                  {(() => {
                    // Pre-process the text to properly handle formatting
                    let formattedText = llmAdvice
                      // Remove any bullet points (• symbol) that might be in the text
                      .replace(/^•\s*/gm, '')
                      .replace(/\n•\s*/g, '\n')
                      
                      // Convert markdown formatting
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      
                      // Split by paragraphs 
                      .split(/\n\n+/)
                      .map((paragraph, pIndex) => {
                        // Check if this paragraph contains recommendation-style text (ALL CAPS followed by colon)
                        if (paragraph.match(/[A-Z\s]+:/) || paragraph.match(/<strong>[A-Z\s]+:<\/strong>/)) {
                          // Split by lines to find potential recommendations
                          const lines = paragraph.split(/\n/).filter(Boolean);
                          
                          // Extract any intro text
                          let introText = '';
                          let recommendations = lines;
                          
                          if (lines.length > 0 && !lines[0].match(/[A-Z\s]+:/) && !lines[0].match(/<strong>[A-Z\s]+:<\/strong>/)) {
                            introText = lines[0];
                            recommendations = lines.slice(1);
                          }
                          
                          // Format recommendations as a proper list
                          return `
                            ${introText ? `<p>${introText}</p>` : ''}
                            <div class="recommendations-list">
                              ${recommendations.map(rec => {
                                // Try to detect if this is a title line (either ALL CAPS: or <strong>TITLE:</strong>)
                                let titleMatch = rec.match(/^(\s*)([A-Z][A-Z\s\-\&\+]+):(.*)/);
                                if (!titleMatch) {
                                  // Try to match an already-bolded title
                                  titleMatch = rec.match(/^(\s*)<strong>([A-Z][A-Z\s\-\&\+]+):<\/strong>(.*)/);
                                }
                                
                                if (titleMatch) {
                                  return `<div class="recommendation-item">
                                    <div><strong>${titleMatch[2]}:</strong>${titleMatch[3]}</div>
                                  </div>`;
                                } else {
                                  return `<div class="recommendation-item">
                                    <div>${rec}</div>
                                  </div>`;
                                }
                              }).join('')}
                            </div>
                          `;
                        } else {
                          // Regular paragraph
                          return `<p>${paragraph}</p>`;
                        }
                      }).join('');
                    
                    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
                  })()}
                </div>
              )}
            </div>
          </div>
        </Box>

        <Divider sx={{ mb: 3 }} />
        
        {/* Assessment data section */}
        <Typography variant="h6" gutterBottom className="section-title">
          Your Information
        </Typography>
        
        <div className="info-sections-container">
          {/* Personal Information */}
          <div className="info-section">
            <Typography variant="subtitle1" className="info-section-title">
              Personal Information
            </Typography>
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableBody>
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
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Health Information */}
          <div className="info-section">
            <Typography variant="subtitle1" className="info-section-title">
              Health Information
            </Typography>
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableBody>
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
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Academic Information */}
          <div className="info-section">
            <Typography variant="subtitle1" className="info-section-title">
              Academic Information
            </Typography>
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableBody>
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
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Social Information */}
          <div className="info-section">
            <Typography variant="subtitle1" className="info-section-title">
              Social Information
            </Typography>
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableBody>
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
        </div>
        
        <Box mt={3} className="disclaimer-box">
          <Typography variant="body2" className="result-disclaimer">
            Disclaimer: This is not a medical diagnosis. Results are based on provided information and
            should be discussed with a healthcare professional.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" className="close-button">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalPrediction;
