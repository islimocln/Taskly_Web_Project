import api from '../api';
import { config } from '../config/config';

class AuthService {
    setToken(token) {
        localStorage.setItem(config.AUTH_TOKEN_KEY, token);
    }

    getToken() {
        return localStorage.getItem(config.AUTH_TOKEN_KEY);
    }

    removeToken() {
        localStorage.removeItem(config.AUTH_TOKEN_KEY);
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    async login(credentials) {
        try {
            const response = await api.post('/Auth/login', credentials);
            if (response.data.token) {
                this.setToken(response.data.token);
                return response.data;
            }
            throw new Error('Token not found in response');
        } catch (error) {
            throw error;
        }
    }

    async signup(userData) {
        try {
            const response = await api.post('/Auth/signup', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        this.removeToken();
        window.location.href = '/login';
    }

    decodeToken() {
        const token = this.getToken();
        if (!token) return null;
        
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Token decode error:', error);
            return null;
        }
    }

    getUserFromToken() {
        const decoded = this.decodeToken();
        if (!decoded) return null;
        
        return {
            id: decoded.nameid,
            email: decoded.email,
            role: decoded.role
        };
    }

    isTokenExpired() {
        const decoded = this.decodeToken();
        if (!decoded) return true;
        
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    }
}

export const authService = new AuthService(); 