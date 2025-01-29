import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/coins';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const addCoin = async (coinData) => {
  try {
    const response = await apiClient.post('/', coinData);
    return response.data;
  } catch (error) {
    console.error('Error adding coin:', error);
    throw error;
  }
};

export const getAllCoins = async () => {
  try {
    const response = await apiClient.get('/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all coins:', error);
    throw error;
  }
};

export const getCoinsByCoinName = async (coinName) => {
    try {
      const response = await apiClient.get(`/?coinName=${coinName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching coins by name:', error);
      throw error;
    }
  };