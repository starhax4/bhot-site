import axios from 'axios';

const API_URL =  'http://localhost:5000';

export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/register`, userData);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed',
      error: error.response?.data || error.message,
    };
  }
};

export const loginUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, userData);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
      error: error.response?.data || error.message,
    };
  }
};
