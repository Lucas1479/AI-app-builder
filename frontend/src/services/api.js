import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Network error - please check your connection'));
    } else {
      // Something else happened
      return Promise.reject(new Error('An unexpected error occurred'));
    }
  }
);

// API endpoints
export const appAPI = {
  // Submit a new app requirement
  submitRequirement: (userDescription) => 
    api.post('/apps/requirements', { userDescription }),
  
  // Get app requirement by ID
  getRequirement: (id) => 
    api.get(`/apps/requirements/${id}`),
  
  // Get all requirements
  getAllRequirements: () => 
    api.get('/apps/requirements'),
  
  // Get AI service status
  getAIStatus: () => 
    api.get('/apps/ai-status'),
  
  // Health check
  healthCheck: () => 
    api.get('/health'),
};

export default api;
