// Google Gemini API service using the official @google/genai library
import { GoogleGenAI } from '@google/genai';

// API key for Gemini
const API_KEY = 'AIzaSyBiTf362s6LZF3ZLu0A2UnsCqKrokyRiYg';

// Initialize the API client
const genAI = new GoogleGenAI({ apiKey: API_KEY });

class GeminiService {
  static async getAdvice(userData) {
    try {
      // Format user data into a prompt
      const prompt = this.formatUserDataForPrompt(userData);
      
      // Call the API directly with the model specified
      const response = await genAI.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt,
      });
      
      // Extract the text response
      return response.text;
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fallback message based on the prediction result
      if (userData.predictionResult) {
        return 'Based on your information, our system has detected signs of depression. We recommend consulting with a mental health professional for a proper diagnosis and personalized support strategies.';
      } else {
        return 'Based on your information, our system has not detected signs of depression. However, if you are experiencing persistent negative feelings, consider speaking with a healthcare professional for support.';
      }
    }
  }

  static formatUserDataForPrompt(userData) {
    const { formData, predictionResult } = userData;
    const personalInfo = formData.personalInfo || {};
    const healthInfo = formData.healthInfo || {};
    const academicInfo = formData.academicInfo || {};
    const socialInfo = formData.socialInfo || {};

    // Format the major field to be more readable
    let major = personalInfo.major || 'Not provided';
    switch(major) {
      case "bpharm": major = "Bachelor of Pharmacy"; break;
      case "bsc": major = "Bachelor of Science"; break;
      case "ba": major = "Bachelor of Arts"; break;
      case "bca": major = "Bachelor of Computer Applications"; break;
      case "bachelor_education": major = "Bachelor of Education"; break;
      case "bachelor_commerce": major = "Bachelor of Commerce"; break;
      case "bachelor_architecture": major = "Bachelor of Architecture"; break;
      case "bachelor_computer": major = "Bachelor of Computer Applications"; break;
      case "class_12": major = "Class 12"; break;
      case "mtech": major = "Master of Technology"; break;
      case "phd": major = "Doctor of Philosophy"; break;
      case "llb": major = "Bachelor of Laws"; break;
      case "be": major = "Bachelor of Engineering"; break;
      case "med": major = "Master of Education"; break;
      case "msc": major = "Master of Science"; break;
      case "bhm": major = "Bachelor of Hotel Management"; break;
      case "mpharm": major = "Master of Pharmacy"; break;
      case "mca": major = "Master of Computer Applications"; break;
      case "ma": major = "Master of Arts"; break;
      case "md": major = "Doctor of Medicine"; break;
      case "mba": major = "Master of Business Administration"; break;
      case "mbbs": major = "Bachelor of Medicine and Bachelor of Surgery"; break;
      case "mcom": major = "Master of Commerce"; break;
      case "llm": major = "Master of Laws"; break;
      case "btech": major = "Bachelor of Technology"; break;
      case "bba": major = "Bachelor of Business Administration"; break;
      case "me": major = "Master of Engineering"; break;
      case "mhm": major = "Master of Hotel Management"; break;
      case "other": major = "Other"; break;
      // No default case needed as we already set a default value
    }

    // Format dietary habits if available
    let dietaryHabits = healthInfo.dietaryHabits || 'Not provided';
    if (dietaryHabits && dietaryHabits !== 'Not provided') {
      dietaryHabits = dietaryHabits.charAt(0).toUpperCase() + dietaryHabits.slice(1);
    }

    return `
You are a supportive mental health advisor. You need to provide personalized advice based on the following user information from a depression screening assessment:

PERSONAL INFORMATION:
- Age: ${personalInfo.age || 'Not provided'}
- Gender: ${personalInfo.gender === 'male' ? 'Male' : personalInfo.gender === 'female' ? 'Female' : 'Not provided'}
- Academic Major: ${major}

HEALTH INFORMATION:
- Sleep Duration: ${healthInfo.sleepDuration || 'Not provided'} hours
- Dietary Habits: ${dietaryHabits}
- Reports Suicidal Thoughts: ${healthInfo.suicidalThoughts === 'yes' ? 'Yes' : healthInfo.suicidalThoughts === 'no' ? 'No' : 'Not provided'}
- Family History of Mental Illness: ${healthInfo.familyHistory === 'yes' ? 'Yes' : healthInfo.familyHistory === 'no' ? 'No' : 'Not provided'}

ACADEMIC INFORMATION:
- Academic Pressure (0-5 scale): ${academicInfo.academicPressure || 'Not provided'}
- Study Satisfaction (0-5 scale): ${academicInfo.studySatisfaction || 'Not provided'}
- Daily Study/Work Hours: ${academicInfo.studyHours || 'Not provided'}
- GPA (0-10 scale): ${academicInfo.gpa || 'Not provided'}

SOCIAL INFORMATION:
- Job Satisfaction (0-4 scale): ${socialInfo.jobSatisfaction || 'Not provided'}
- Financial Stress: ${socialInfo.financialStress === 'yes' ? 'Yes' : socialInfo.financialStress === 'no' ? 'No' : 'Not provided'}
- Work Pressure (0-5 scale): ${socialInfo.workPressure || 'Not provided'}

ASSESSMENT RESULT: ${predictionResult ? 'Depression risk detected' : 'No depression risk detected'}

You are a compassionate psychologist. Based on this assessment information, provide actionable advice to improve the user's well-being. Focus exclusively on practical steps they can take, not on analyzing their condition.

Your response should:
1. Be warm and supportive in tone
2. List 3-4 specific, personalized actions they can take immediately to improve their mental health
3. Include lifestyle suggestions relevant to their academic/work life and social circumstances
4. Be direct, clear, and encouraging
5. Be 4-5 sentences only

Address them directly as "you" and focus on positive, forward-looking advice. Don't mention that you're an AI or that your advice is computer-generated. Write as an experienced mental health professional.
`;
  }
}

export default GeminiService; 