import api from '../api';

export const projectDocumentService = {
    getAllDocuments: async () => {
        const response = await api.get('/projectdocuments');
        return response.data;
    },

    getDocumentsByProject: async (projectId) => {
        const response = await api.get(`/projectdocuments/project/${projectId}`);
        return response.data;
    },

    uploadDocument: async (formData) => {
        const response = await api.post('/projectdocuments', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    updateDocument: async (documentId, documentData) => {
        const response = await api.put(`/projectdocuments/${documentId}`, documentData);
        return response.data;
    },

    deleteDocument: async (documentId) => {
        const response = await api.delete(`/projectdocuments/${documentId}`);
        return response.data;
    },

    downloadDocument: async (documentId) => {
        const response = await api.get(`/projectdocuments/${documentId}/download`, {
            responseType: 'blob'
        });
        return response.data;
    }
}; 