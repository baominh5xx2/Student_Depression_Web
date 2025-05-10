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

You are a compassionate psychologist. Based on this assessment information, create a response with the following structure:

1. FIRST PARAGRAPH (2–3 sentences):
Start with a short, empathetic reflection on what the person seems to be going through. Acknowledge their effort and emotional experience based on the assessment data. Keep the tone understanding, natural, and not too clinical.

2. SECOND PARAGRAPH (1–2 sentences):
Gently highlight what kind of overall support or change could really help their mental wellbeing. Be encouraging and use plain language.

3. RECOMMENDATIONS (bullet points):
List 3–4 clear, practical tips they can start trying right away.
• Each tip should be specific, realistic, and directly connected to their academic, health, or social habits
• Avoid generic advice — tailor suggestions to what the data shows
• Write each point as a standalone idea for easy reading

*Style Guidelines:
- Speak directly to "you" (the person being assessed)
- Keep your tone warm, real, and supportive — like a therapist who genuinely cares
- Avoid robotic or overly formal language
- Do not say the advice is generated by AI or based on a script
- Insert TWO line breaks between paragraphs
- NEVER use any bullet points, asterisks or symbols at the beginning of lines
- Each recommendation should start with an ALL CAPS TITLE followed by a colon
- For recommendation titles, use simple words like SLEEP QUALITY, STUDY HABITS, SOCIAL CONNECTIONS
- Avoid special characters in titles except for simple spaces between words
- IMPORTANT: Do not use the • symbol anywhere in your response
- Do not use Markdown formatting like ** for bold text

FORMAT EXAMPLE:
First paragraph text here with 2-3 sentences.

Second paragraph with 1-2 sentences.

SLEEP QUALITY: First specific recommendation details and advice. Make this detailed enough to be helpful.

STUDY HABITS: Second specific recommendation with practical steps the person can take.

SOCIAL CONNECTIONS: Third specific recommendation focused on their particular situation.

SELF CARE: Any additional advice that might be helpful based on their assessment data.
`;
  }
}

export default GeminiService; 