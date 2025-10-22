import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const sendMessageToGemini = async (message, context = null) => {
  try {
    const response = await axios.post(`${API_URL}/gemini/chat`, {
      message,
      context
    });
    
    return response.data;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(
      error.response?.data?.error || 
      'Failed to connect to AI service. Please ensure backend is running on port 5000.'
    );
  }
};

export const getContextForGemini = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/dashboard`);
    return {
      salesData: response.data.kpis
    };
  } catch (error) {
    console.error('Context fetch error:', error);
    return null;
  }
};

