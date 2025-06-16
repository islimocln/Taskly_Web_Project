import api from '../api';

export const teamMemberService = {
    addMember: async (teamId, memberData) => {
        const response = await api.post('/teammembers', {
            teamId,
            ...memberData
        });
        return response.data;
    },

    removeMember: async (teamMemberId) => {
        const response = await api.delete(`/teammembers/${teamMemberId}`);
        return response.data;
    },

    updateMemberTitle: async (teamMemberId, title) => {
        const response = await api.put(`/teammembers/${teamMemberId}`, { title });
        return response.data;
    },

    getTeamMembers: async (teamId) => {
        const response = await api.get(`/teammembers/team/${teamId}`);
        return response.data;
    },

    getMemberDetails: async (teamMemberId) => {
        const response = await api.get(`/teammembers/${teamMemberId}`);
        return response.data;
    },

    getAvailableUsersForTeam: async (teamId) => {
        const response = await api.get(`/teammembers/team/${teamId}/available-users`);
        return response.data;
    }
}; 