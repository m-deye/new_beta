import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',  // URL de base de l'API
  
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
