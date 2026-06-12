import axios from 'axios';

// Configura la URL base según el entorno
const API_URL = import.meta.env.VITE_API_URL || 'https://muce-backend.onrender.com';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000, // 30 segundos para evitar timeout por cold start
});

// Interceptor para agregar token a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores (opcional pero recomendado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Error: El servidor tarda en responder. Intenta nuevamente.');
      // Puedes mostrar un mensaje al usuario aquí
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;