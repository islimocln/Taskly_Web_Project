import api from '../api';

export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/user');
        return response.data;
    },

    getUserDetails: async (userId) => {
        const response = await api.get(`/user/getdetails/${userId}`);
        return response.data;
    },

    updateUserProfile: async (userId, userData) => {
        const response = await api.put(`/user/${userId}`, userData);
        return response.data;
    },

    getUserTeams: async (userId) => {
        const response = await api.get(`/user/${userId}/teams`);
        return response.data;
    },

    getUserProjects: async (userId) => {
        const response = await api.get(`/user/${userId}/projects`);
        return response.data;
    }
}; 