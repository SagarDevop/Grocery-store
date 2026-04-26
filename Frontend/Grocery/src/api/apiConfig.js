import axios from 'axios';

/**
 * Global API Configuration
 * Toggle between local and production backend here.
 */
const IS_PRODUCTION = window.location.hostname !== 'localhost';
const LOCAL_URL = 'http://localhost:5000';
const PROD_URL = 'https://grocery-store-754w.onrender.com';

export const BASE_URL = IS_PRODUCTION ? PROD_URL : LOCAL_URL;

// Create a pre-configured Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Legacy support for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    
    // Safety check: sometimes localStorage stores 'undefined' or 'null' as strings
    if (token === 'undefined' || token === 'null') {
      token = null;
      localStorage.removeItem('token');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors (like 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 Unauthorized, it means the token is invalid/expired
    if (error.response && error.response.status === 401) {
      console.warn("🔐 Session expired or invalid signature. Clearing local session state.");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Broadcast a global signal so the App can clear Redux memory state
      window.dispatchEvent(new Event('session-expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
