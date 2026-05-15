import axios from "axios";

// Base URL for the backend API
const API_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me")
};

// Products API
export const productsAPI = {
  getAll: (search = "", category = "") => {
    let url = "/products";
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (params.toString()) url += `?${params.toString()}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

// Comments API
export const commentsAPI = {
  getByProduct: (productId) => api.get(`/comments/product/${productId}`),
  add: (data) => api.post("/comments", data)
};

// Favorites API
export const favoritesAPI = {
  getAll: () => api.get("/favorites"),
  add: (productId) => api.post(`/favorites/${productId}`),
  remove: (productId) => api.delete(`/favorites/${productId}`)
};

// Messages API
export const messagesAPI = {
  getByUser: (otherUserId) => api.get(`/messages/${otherUserId}`),
  send: (data) => api.post("/messages", data)
};

export default api;