import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Admin Section API
export const getAllSectionsAdmin = () => api.get('/admin/courses/sections').then(res => res.data);
export const createSection = (data) => api.post('/admin/courses/sections', data).then(res => res.data);
export const updateSection = (id, data) => api.put(`/admin/courses/sections/${id}`, data).then(res => res.data);
export const deleteSection = (id) => api.delete(`/admin/courses/sections/${id}`).then(res => res.data);

// Admin Topic API
export const createTopic = (data) => api.post('/admin/courses/topics', data).then(res => res.data);
export const updateTopic = (id, data) => api.put(`/admin/courses/topics/${id}`, data).then(res => res.data);
export const deleteTopic = (id) => api.delete(`/admin/courses/topics/${id}`).then(res => res.data);

export default api;
