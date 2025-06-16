import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectDocumentService } from '../../services/projectDocument.service';

export const fetchDocuments = createAsyncThunk('documents/fetchDocuments', async (_, { rejectWithValue }) => {
    try {
        const docs = await projectDocumentService.getAllDocuments();
        return docs;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const uploadDocument = createAsyncThunk('documents/uploadDocument', async (formData, { rejectWithValue }) => {
    try {
        const doc = await projectDocumentService.uploadDocument(formData);
        return doc;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const deleteDocument = createAsyncThunk('documents/deleteDocument', async (id, { rejectWithValue }) => {
    try {
        await projectDocumentService.deleteDocument(id);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const downloadDocument = createAsyncThunk('documents/downloadDocument', async (id, { rejectWithValue }) => {
    try {
        const file = await projectDocumentService.downloadDocument(id);
        return { id, file };
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const documentSlice = createSlice({
    name: 'documents',
    initialState: {
        documents: [],
        loading: false,
        error: null,
        currentDocument: null
    },
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
            .addCase(fetchDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload;
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(uploadDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.loading = false;
                // Optionally, you can push the new doc or refetch
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = state.documents.filter(d => d.id !== action.payload);
            })
            .addCase(deleteDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setCurrentDocument, clearError } = documentSlice.actions;
export default documentSlice.reducer; 