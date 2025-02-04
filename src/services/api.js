import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/coins'; // Base URL for the API

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllUniqueCoinNames = async () => {
  const response = await apiClient.get('/unique-names');
  return response.data;
};

export const addNewCoin = async (coinName) => {
  const response = await apiClient.post('/add-coin', { name: coinName });
  return response.data;
};

export const addCoin = async (entry) => {
    try {
      const response = await apiClient.post('/', entry); 
      return response.data;
    } catch (error) {
      console.error('Error adding new entry:', error);
      throw error;
    }
  };

export const getCoinsByCoinName = async (coinName) => {
  const response = await apiClient.get(`?coinName=${coinName}`);
  return response.data;
};

export const getEntriesByDateRange = async (coinName, startDate, endDate) => {
  try {
    const response = await apiClient.get(`/entries-by-date-range`, {
      params: {
        coinName,
        startDate,
        endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching entries by date range:', error);
    throw error;
  }
};