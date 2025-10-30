import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Always add token to requests. (Session cookies for JWT if backend sends cookies)
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

// ---- Auth APIs ----
export const register = (userData) => api.post("/auth/register", userData);
export const login = (credentials) => api.post("/auth/login", credentials);
export const getCurrentUser = () => api.get("/auth/me", { withCredentials: true });
export const updateProfile = (profileData) => api.put("/auth/profile", profileData, { withCredentials: true });

// ---- Career APIs ----
export const getCareerRecommendations = (data) => api.post("/career/recommend", data, { withCredentials: true });
export const getSavedRecommendations = () => api.get("/career/recommendations", { withCredentials: true });

// ---- Mentor APIs ----
export const matchMentors = () => api.post("/mentor/match", {}, { withCredentials: true });
export const getMentors = () => api.get("/mentor/list", { withCredentials: true });
export const getSavedMatches = () => api.get("/mentor/matches", { withCredentials: true });

export default api;
