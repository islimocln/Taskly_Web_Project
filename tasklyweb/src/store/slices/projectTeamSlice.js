import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectTeamService } from '../../services/projectTeam.service';

// Async thunks
export const assignTeamToProject = createAsyncThunk(
    'projectTeam/assignTeamToProject',
    async ({ projectId, teamId }, { rejectWithValue }) => {
        try {
            const response = await projectTeamService.assignTeamToProject(projectId, teamId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const removeTeamFromProject = createAsyncThunk(
    'projectTeam/removeTeamFromProject',
    async ({ projectId, teamId }, { rejectWithValue }) => {
        try {
            await projectTeamService.removeTeamFromProject(projectId, teamId);
            return { projectId, teamId };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getTeamsByProject = createAsyncThunk(
    'projectTeam/getTeamsByProject',
    async (projectId, { rejectWithValue }) => {
        try {
            const teams = await projectTeamService.getTeamsByProject(projectId);
            return teams;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getProjectTeamMembers = createAsyncThunk(
    'projectTeam/getProjectTeamMembers',
    async (projectId, { rejectWithValue }) => {
        try {
            const members = await projectTeamService.getProjectTeamMembers(projectId);
            return members;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    projectTeams: [],
    teamMembers: [],
    loading: false,
    error: null
};

const projectTeamSlice = createSlice({
    name: 'projectTeam',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Assign Team to Project
            .addCase(assignTeamToProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(assignTeamToProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projectTeams.push(action.payload);
            })
            .addCase(assignTeamToProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove Team from Project
            .addCase(removeTeamFromProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeTeamFromProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projectTeams = state.projectTeams.filter(
                    team => !(team.projectId === action.payload.projectId && team.teamId === action.payload.teamId)
                );
            })
            .addCase(removeTeamFromProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Teams by Project
            .addCase(getTeamsByProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTeamsByProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projectTeams = action.payload;
            })
            .addCase(getTeamsByProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Project Team Members
            .addCase(getProjectTeamMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProjectTeamMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.teamMembers = action.payload;
            })
            .addCase(getProjectTeamMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = projectTeamSlice.actions;
export default projectTeamSlice.reducer; 