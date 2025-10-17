// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

// Interceptadores para debug
api.interceptors.request.use(config => {
  console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error(`❌ Erro ${error.response?.status}: ${error.message}`);
    return Promise.reject(error);
  }
);

export default api;