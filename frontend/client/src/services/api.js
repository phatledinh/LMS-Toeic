import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Optionally add interceptors here to append JWT tokens if not using HTTP-only cookies
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve token if stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getSections = () => api.get('/courses/sections').then(res => res.data);
export const getSectionBySlug = (slug) => api.get(`/courses/sections/${slug}`).then(res => res.data);

export default api;
