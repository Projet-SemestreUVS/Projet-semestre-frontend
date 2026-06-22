import axios from "axios";

const api = axios.create({
        baseURL:"http://localhost:8000/api",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }
});

// Ajouter le token automatiquement
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};
            // Utilisation directe de la propriété Authorization de manière sécurisée
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;