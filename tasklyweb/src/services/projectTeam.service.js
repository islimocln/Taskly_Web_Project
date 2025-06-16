import api from '../api';

export const projectTeamService = {
    assignTeamToProject: async (projectId, teamId) => {
        const response = await api.post('/ProjectTeams', {
            projectId,
            teamId
        });
        return response.data;
    },

    removeTeamFromProject: async (projectTeamId) => {
        const response = await api.delete(`/ProjectTeams/${projectTeamId}`);
        return response.data;
    },

    getTeamsByProject: async (projectId) => {
        const response = await api.get(`/ProjectTeams/project/${projectId}`);
        return response.data;
    },

    getProjectTeamMembers: async (projectId) => {
        const response = await api.get(`/ProjectTeams/project/${projectId}/members`);
        return response.data;
    }
}; 