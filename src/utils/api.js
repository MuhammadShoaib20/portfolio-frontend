import axios from 'axios';

/**
 * Base API URL
 * Dev  : http://localhost:5000/api
 * Prod : set REACT_APP_API_URL in env
 */
const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Axios Instance
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Request Interceptor
 * Attach token ONLY if exists
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // Attach token only for protected routes
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handle auth expiration
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Prevent infinite redirect loop
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

/* ============================
   AUTH API
============================ */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data) => api.put('/auth/updateprofile', data),
  changePassword: (data) => api.put('/auth/changepassword', data),
  registerViewer: (data) => api.post('/auth/register-viewer', data), // <-- new
};

/* ============================
   PROJECTS API
============================ */
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  like: (id) => api.put(`/projects/${id}/like`),
  toggleFeatured: (id) => api.put(`/projects/${id}/featured`),
};

/* ============================
   BLOGS API
============================ */
export const blogsAPI = {
  getAll: (params) => api.get('/blogs', { params }),       // public
  getAllAdmin: () => api.get('/blogs/admin'),              // admin
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  like: (id) => api.put(`/blogs/${id}/like`),
  togglePublish: (id) => api.put(`/blogs/${id}/publish`),
};

/* ============================
   CONTACT API
============================ */
export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  getById: (id) => api.get(`/contact/${id}`),
  updateStatus: (id, status) =>
    api.put(`/contact/${id}`, { status }),
  delete: (id) => api.delete(`/contact/${id}`),
};

/* ============================
   PROFILE API
============================ */
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};

/* ============================
   USERS API (ADMIN)
============================ */
export const userAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  delete: (id) => api.delete(`/users/${id}`),
};

/* ============================
   RESUME API
============================ */
export const resumeAPI = {
  getAll: () => api.get('/resumes'),              // admin
  getActive: () => api.get('/resumes/active'),    // public
  create: (data) => api.post('/resumes', data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
  toggle: (id) => api.put(`/resumes/${id}/toggle`),

  // 🔥 DOWNLOAD (blob support)
  download: (url) =>
    api.get(url, {
      responseType: 'blob',
    }),
};

export default api;