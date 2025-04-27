import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const fetchTransactions = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/blockchain/transactions/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const subscribeToTransactions = (userId: string, callback: (tx: any) => void) => {
  const eventSource = new EventSource(`${API_URL}/blockchain/transactions/stream?userId=${userId}`);

  eventSource.onmessage = (event) => {
    const transaction = JSON.parse(event.data);
    callback(transaction);
  };

  eventSource.onerror = (error) => {
    console.error('EventSource failed:', error);
    eventSource.close();
  };

  return () => eventSource.close();
};

export const fetchBlockchainStats = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/blockchain/stats/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blockchain stats:', error);
    return null;
  }
};