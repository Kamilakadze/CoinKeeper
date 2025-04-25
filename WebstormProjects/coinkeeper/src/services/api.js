import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

console.log('API URL:', API_URL); // Log the API URL being used

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      message: error.message,
      response: error.response,
    });
    return Promise.reject(error);
  }
);

// Auth API
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const logout = () => api.post('/auth/logout');

// Transactions API
export const getTransactions = () => api.get('/transactions');
export const addTransaction = (transaction) => api.post('/transactions', transaction);
export const updateTransaction = (id, transaction) => api.put(`/transactions/${id}`, transaction);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

// Categories API
export const getCategories = () => api.get('/categories');
export const addCategory = (category) => api.post('/categories', category);
export const updateCategory = (id, category) => api.put(`/categories/${id}`, category);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export default api; 