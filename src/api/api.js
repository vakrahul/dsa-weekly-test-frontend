import axios from 'axios';

const api = axios.create({
  // Use the Vercel environment variable, or localhost for local development
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

export default api;