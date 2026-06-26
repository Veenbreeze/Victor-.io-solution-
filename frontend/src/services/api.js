import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('veenbreeze_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('veenbreeze_token');
      localStorage.removeItem('veenbreeze_user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  providers: () => api.get('/auth/providers'),
  me: () => api.get('/users/me')
};

export const serviceService = {
  list: () => api.get('/services'),
  create: (payload) => api.post('/services', payload),
  update: (id, payload) => api.put(`/services/${id}`, payload),
  remove: (id) => api.delete(`/services/${id}`)
};

export const portfolioService = {
  list: () => api.get('/portfolio'),
  create: (payload) => api.post('/portfolio', payload),
  update: (id, payload) => api.put(`/portfolio/${id}`, payload),
  remove: (id) => api.delete(`/portfolio/${id}`)
};

export const userService = {
  list: () => api.get('/users'),
  update: (id, payload) => api.put(`/users/${id}`, payload),
  remove: (id) => api.delete(`/users/${id}`)
};

export const messageService = {
  send: (payload) => api.post('/contact', payload),
  list: () => api.get('/messages'),
  remove: (id) => api.delete(`/messages/${id}`)
};

export const adminService = {
  stats: () => api.get('/admin/stats')
};

export const eventService = {
  list: () => api.get('/events'),
  upcoming: (limit = 5) => api.get('/events/upcoming', { params: { limit } }),
  create: (payload) => api.post('/events', payload),
  update: (id, payload) => api.put(`/events/${id}`, payload),
  remove: (id) => api.delete(`/events/${id}`)
};

export default api;
