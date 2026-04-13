import axios from 'axios';

/**
 * Global API Configuration
 * Toggle between local and production backend here.
 */
const IS_PRODUCTION = true; // Set to true when deploying
const LOCAL_URL = 'http://localhost:5000';
const PROD_URL = 'https://grocery-store-ue2n.onrender.com';

export const BASE_URL = IS_PRODUCTION ? PROD_URL : LOCAL_URL;

// Create a pre-configured Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Crucial for Cookie-based JWT
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
