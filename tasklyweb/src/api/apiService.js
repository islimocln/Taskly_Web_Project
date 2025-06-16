import axios from 'axios';
import { authService } from '../services/auth.service';

const API_BASE_URL = 'http://192.168.1.105:5055/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authService.removeToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 