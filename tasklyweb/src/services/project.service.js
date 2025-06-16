import api from '../api';

export const projectService = {
    getAllProjects: async () => {
        const response = await api.get('/Projects');
        return response.data;
    },

    getProjectById: async (id) => {
        const response = await api.get(`/Projects/${id}`);
        return response.data;
    },

    createProject: async (projectData) => {
        const response = await api.post('/Projects', projectData);
        return response.data;
    },

    updateProject: async (id, projectData) => {
        const response = await api.put(`/Projects/${id}`, projectData);
        return response.data;
    },

    deleteProject: async (id) => {
        const response = await api.delete(`/Projects/${id}`);
        return response.data;
    },

    getProjectTeams: async (projectId) => {
        const response = await api.get(`/ProjectTeams/project/${projectId}`);
        return response.data;
    },

    getProjectDocuments: async (projectId) => {
        const response = await api.get(`/ProjectDocuments/project/${projectId}`);
        return response.data;
    }
}; 