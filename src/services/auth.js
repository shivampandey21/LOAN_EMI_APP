import api from './api';
// import API_ENDPOINTS from './apiEndpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_ENDPOINTS from './apiEndpoints';

export const login = async (email, password) => {
  const response = await api.post(API_ENDPOINTS.LOGIN, {
    email,
    password,
  });

  if (response.data?.token) {
    await AsyncStorage.setItem('token', response.data.token);
  }

  return response.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
};
