import axios from 'axios';
import { config } from '../config/config';
import { authService } from '../services/auth.service';

const api = axios.create({
    baseURL: config.API_BASE_URL,
    timeout: config.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (requestConfig) => {
        const token = authService.getToken();
        if (token) {
            // Token'ın süresi dolmuşsa logout yap
            if (authService.isTokenExpired()) {
                authService.logout();
                return Promise.reject('Token süresi doldu');
            }
            requestConfig.headers[config.JWT.TOKEN_HEADER] = `${config.JWT.TOKEN_PREFIX}${token}`;
        }
        return requestConfig;
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