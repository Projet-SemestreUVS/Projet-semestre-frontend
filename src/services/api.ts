import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

<<<<<<< HEAD
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});
=======
// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
>>>>>>> b30279c2fe5e33706b3c20578bce318aa335756d

export default api;