import axiosInstance from './axios.config.js';
import { endpoints } from './endpoints.js';

export const salesApi = {
  getDashboardSummary: async (params = {}) => {
    const response = await axiosInstance.get(endpoints.salesSummary, { params });
    return response.data;
  },

  getSalesReport: async (period = 'monthly') => {
    const response = await axiosInstance.get(endpoints.salesReport, {
      params: { period }
    });
    return response.data;
  },

  getTopProducts: async () => {
    const response = await axiosInstance.get(endpoints.topProducts);
    return response.data;
  },

  getSalesByRegion: async () => {
    const response = await axiosInstance.get(endpoints.salesByRegion);
    return response.data;
  },
};
