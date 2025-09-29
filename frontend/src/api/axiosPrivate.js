import axios from 'axios';

const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  // Pour les requêtes avec cookies/session
});

export default axiosPrivate;
