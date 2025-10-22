import axiosInstance from './axios.config.js';
import { endpoints } from './endpoints.js';

export const geminiApi = {
  sendMessage: async (message, conversationHistory = []) => {
    const response = await axiosInstance.post(endpoints.aiChat, {
      message,
      conversationHistory
    });
    return response.data;
  },

  getInsights: async (type = 'general') => {
    const response = await axiosInstance.get(endpoints.aiInsights, {
      params: { type }
    });
    return response.data;
  },
};
