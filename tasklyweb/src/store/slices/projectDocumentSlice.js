import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectDocumentService } from '../../services/projectDocument.service';

// Async thunks
export const fetchAllDocuments = createAsyncThunk(
    'projectDocument/fetchAllDocuments',
    async (_, { rejectWithValue }) => {
        try {
            const documents = await projectDocumentService.getAllDocuments();
            return documents;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchDocumentsByProject = createAsyncThunk(
    'projectDocument/fetchDocumentsByProject',
    async (projectId, { rejectWithValue }) => {
        try {
            const documents = await projectDocumentService.getDocumentsByProject(projectId);
            return documents;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const uploadDocument = createAsyncThunk(
    'projectDocument/uploadDocument',
    async ({ projectId, file }, { rejectWithValue }) => {
        try {
            const document = await projectDocumentService.uploadDocument(projectId, file);
            return document;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateDocument = createAsyncThunk(
    'projectDocument/updateDocument',
    async ({ documentId, documentData }, { rejectWithValue }) => {
        try {
            const document = await projectDocumentService.updateDocument(documentId, documentData);
            return document;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteDocument = createAsyncThunk(
    'projectDocument/deleteDocument',
    async (documentId, { rejectWithValue }) => {
        try {
            await projectDocumentService.deleteDocument(documentId);
            return documentId;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const downloadDocument = createAsyncThunk(
    'projectDocument/downloadDocument',
    async (documentId, { rejectWithValue }) => {
        try {
            const document = await projectDocumentService.downloadDocument(documentId);
            return document;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    documents: [],
    currentDocument: null,
    loading: false,
    error: null
};

const projectDocumentSlice = createSlice({
    name: 'projectDocument',
    initialState,
    reducers: {
        setCurrentDocument: (state, action) => {
            state.currentDocument = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Documents
            .addCase(fetchAllDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload;
            })
            .addCase(fetchAllDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Documents by Project
            .addCase(fetchDocumentsByProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocumentsByProject.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload;
            })
            .addCase(fetchDocumentsByProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Upload Document
            .addCase(uploadDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.documents.push(action.payload);
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Document
            .addCase(updateDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDocument.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.documents.findIndex(doc => doc.id === action.payload.id);
                if (index !== -1) {
                    state.documents[index] = action.payload;
                }
                if (state.currentDocument?.id === action.payload.id) {
                    state.currentDocument = action.payload;
                }
            })
            .addCase(updateDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Document
            .addCase(deleteDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = state.documents.filter(doc => doc.id !== action.payload);
                if (state.currentDocument?.id === action.payload) {
                    state.currentDocument = null;
                }
            })
            .addCase(deleteDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Download Document
            .addCase(downloadDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(downloadDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDocument = action.payload;
            })
            .addCase(downloadDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setCurrentDocument, clearError } = projectDocumentSlice.actions;
export default projectDocumentSlice.reducer; 