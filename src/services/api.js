import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_ENDPOINTS from './apiEndpoints';
// import API_ENDPOINTS from './apiEndpoints';

const api = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 🔐 Attach JWT automatically
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');

    console.log('➡️ API REQUEST:', {
      url: config.baseURL + config.url,
      method: config.method,
      data: config.data,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// 📥 Response Logger
api.interceptors.response.use(
  response => {
    console.log('✅ API RESPONSE:', response.data);
    return response;
  },
  error => {
    console.log('❌ API ERROR:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export default api;
