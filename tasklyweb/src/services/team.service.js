import api from '../api';

export const teamService = {
    getAllTeams: async () => {
        const response = await api.get('/teams');
        return response.data;
    },

    getTeamById: async (id) => {
        const response = await api.get(`/teams/${id}`);
        return response.data;
    },

    createTeam: async (teamData) => {
        const response = await api.post('/teams', teamData);
        return response.data;
    },

    updateTeam: async (teamData) => {
        const response = await api.put('/teams', teamData);
        return response.data;
    },

    deleteTeam: async (id) => {
        const response = await api.delete(`/teams/${id}`);
        return response.data;
    },

    getTeamMembers: async (teamId) => {
        const response = await api.get(`/teams/${teamId}/members`);
        return response.data;
    },

    addTeamMember: async (teamId, memberData) => {
        const response = await api.post(`/teams/${teamId}/members`, memberData);
        return response.data;
    },

    removeTeamMember: async (teamId, memberId) => {
        const response = await api.delete(`/teams/${teamId}/members/${memberId}`);
        return response.data;
    },

    getTeamsWithMembers: async () => {
        const response = await api.get('/teammembers/GetTeamandMemebersForTeamsCard');
        return response.data;
    }
}; 