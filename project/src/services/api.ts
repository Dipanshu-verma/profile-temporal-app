import axios from 'axios';
import { User, ProfileFormData, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth0_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const userService = {
  async loginUser(email: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await api.post('/users/login', { email, ...userData });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to login user');
    }
  },

  async getProfile(email: string): Promise<ApiResponse<User>> {
    try {
      const response = await api.get(`/users/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  async updateProfile(email: string, profileData: ProfileFormData): Promise<ApiResponse<User>> {
    try {
      const response = await api.put(`/users/${encodeURIComponent(email)}`, profileData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  async getWorkflowStatus(workflowId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/workflow/${workflowId}/status`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get workflow status');
    }
  },
};

export default api;