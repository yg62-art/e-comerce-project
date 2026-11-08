import axios from 'axios';

const API = axios.create({
  baseURL: 'https://dummyjson.com',
});

export const loginUser = async (username, password) => {
  try {
    const response = await API.post('/auth/login', { username, password, expiresInfinityMins: 30, });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message
  }
};

export default API;