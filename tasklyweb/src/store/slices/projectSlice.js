import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '../../services/project.service';

// Async thunks
export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (_, { rejectWithValue }) => {
        try {
            const projects = await projectService.getAllProjects();
            return projects;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchProjectById = createAsyncThunk(
    'projects/fetchProjectById',
    async (projectId, { rejectWithValue }) => {
        try {
            const project = await projectService.getProjectById(projectId);
            return project;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/createProject',
    async (projectData, { rejectWithValue }) => {
        try {
            const project = await projectService.createProject(projectData);
            return project;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async (projectData, { rejectWithValue }) => {
        try {
            const project = await projectService.updateProject(projectData);
            return project;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (projectId, { rejectWithValue }) => {
        try {
            await projectService.deleteProject(projectId);
            return projectId;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    projects: [],
    currentProject: null,
    loading: false,
    error: null
};

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setCurrentProject: (state, action) => {
            state.currentProject = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Project By Id
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProject = action.payload;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Project
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects.push(action.payload);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Project
            .addCase(updateProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.projects.findIndex(project => project.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
                if (state.currentProject?.id === action.payload.id) {
                    state.currentProject = action.payload;
                }
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Project
            .addCase(deleteProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = state.projects.filter(project => project.id !== action.payload);
                if (state.currentProject?.id === action.payload) {
                    state.currentProject = null;
                }
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setCurrentProject, clearError } = projectSlice.actions;
export default projectSlice.reducer; 