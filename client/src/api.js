import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});
// attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('imovies_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errMsg = (e, fallback = 'Something went wrong. Try again.') =>
  e?.response?.data?.message || fallback;

export default api;
