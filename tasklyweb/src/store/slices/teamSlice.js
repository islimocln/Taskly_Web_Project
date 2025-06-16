import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teamService } from '../../services/team.service';

// Async thunks
export const fetchTeams = createAsyncThunk(
    'teams/fetchTeams',
    async (_, { rejectWithValue }) => {
        try {
            const teams = await teamService.getAllTeams();
            return teams;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchTeamById = createAsyncThunk(
    'teams/fetchTeamById',
    async (teamId, { rejectWithValue }) => {
        try {
            const team = await teamService.getTeamById(teamId);
            return team;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createTeam = createAsyncThunk(
    'teams/createTeam',
    async (teamData, { rejectWithValue }) => {
        try {
            const team = await teamService.createTeam(teamData);
            return team;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateTeam = createAsyncThunk(
    'teams/updateTeam',
    async (teamData, { rejectWithValue }) => {
        try {
            const team = await teamService.updateTeam(teamData);
            return team;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteTeam = createAsyncThunk(
    'teams/deleteTeam',
    async (teamId, { rejectWithValue }) => {
        try {
            await teamService.deleteTeam(teamId);
            return teamId;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchTeamsWithMembers = createAsyncThunk(
    'teams/fetchTeamsWithMembers',
    async (_, { rejectWithValue }) => {
        try {
            const teams = await teamService.getTeamsWithMembers();
            return teams;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    teams: [],
    currentTeam: null,
    loading: false,
    error: null
};

const teamSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        setCurrentTeam: (state, action) => {
            state.currentTeam = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Teams
            .addCase(fetchTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeams.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload;
            })
            .addCase(fetchTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Team by Id
            .addCase(fetchTeamById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTeam = action.payload;
            })
            .addCase(fetchTeamById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Team
            .addCase(createTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTeam.fulfilled, (state, action) => {
                state.loading = false;
                state.teams.push(action.payload);
            })
            .addCase(createTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Team
            .addCase(updateTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTeam.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.teams.findIndex(team => team.id === action.payload.id);
                if (index !== -1) {
                    state.teams[index] = action.payload;
                }
                if (state.currentTeam?.id === action.payload.id) {
                    state.currentTeam = action.payload;
                }
            })
            .addCase(updateTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Team
            .addCase(deleteTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTeam.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = state.teams.filter(team => team.id !== action.payload);
                if (state.currentTeam?.id === action.payload) {
                    state.currentTeam = null;
                }
            })
            .addCase(deleteTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchTeamsWithMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamsWithMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload;
            })
            .addCase(fetchTeamsWithMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setCurrentTeam, clearError } = teamSlice.actions;
export default teamSlice.reducer; 