import axios from 'axios';

const api = axios.create({
  baseURL: 'https://chie-aqui-back.onrender.com/api/',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const signupEndpoints = ['/consumidores/cadastro/', '/empresas/cadastro/'];
    const isSignupRequest = signupEndpoints.some(endpoint => config.url?.includes(endpoint));

    if (token && !isSignupRequest) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
