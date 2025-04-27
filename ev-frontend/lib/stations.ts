import apiClient from './api';

export const getStations = async () => {
  const response = await apiClient.get('/stations');
  return response.data;
};

export const getStationDetails = async (id: number) => {
  const response = await apiClient.get(`/stations/${id}`);
  return response.data;
};

export const getNearbyStations = async (lat: number, lng: number, radius: number) => {
  const response = await apiClient.get(
    `/stations/nearby?latitude=${lat}&longitude=${lng}&radius=${radius}`
  );
  return response.data;
};

export const addFavorite = async (stationId: number) => {
  const response = await apiClient.post('/users/favorites', { stationId });
  return response.data;
};

export const removeFavorite = async (stationId: number) => {
  const response = await apiClient.delete(`/users/favorites/${stationId}`);
  return response.data;
};

export const getFavorites = async () => {
  const response = await apiClient.get('/users/favorites');
  return response.data;
};