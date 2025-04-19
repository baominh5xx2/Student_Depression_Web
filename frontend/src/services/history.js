import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const HistoryService = {
    // Save prediction history
    async savePrediction(inputData, prediction, probabilities, userName) {
        try {
            const response = await axios.post(`${API_URL}/history/save`, {
                input_data: inputData,
                prediction: prediction,
                probabilities: probabilities,
                user_name: userName
            });
            return response.data;
        } catch (error) {
            console.error('Error saving prediction:', error);
            throw error;
        }
    },

    // Get prediction history
    async getHistory(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/history/list`, {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching history:', error);
            throw error;
        }
    }
};

export default HistoryService;