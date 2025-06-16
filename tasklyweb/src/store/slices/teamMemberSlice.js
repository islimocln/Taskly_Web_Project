import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teamMemberService } from '../../services/teamMember.service';

// Async thunks
export const addMember = createAsyncThunk(
    'teamMember/addMember',
    async ({ teamId, memberData }, { rejectWithValue }) => {
        try {
            const member = await teamMemberService.addMember(teamId, memberData);
            return member;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const removeMember = createAsyncThunk(
    'teamMember/removeMember',
    async ({ teamId, memberId }, { rejectWithValue }) => {
        try {
            await teamMemberService.removeMember(teamId, memberId);
            return { teamId, memberId };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateMemberTitle = createAsyncThunk(
    'teamMember/updateMemberTitle',
    async ({ teamId, memberId, title }, { rejectWithValue }) => {
        try {
            const member = await teamMemberService.updateMemberTitle(teamId, memberId, title);
            return member;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getTeamMembers = createAsyncThunk(
    'teamMember/getTeamMembers',
    async (teamId, { rejectWithValue }) => {
        try {
            const members = await teamMemberService.getTeamMembers(teamId);
            return members;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getMemberDetails = createAsyncThunk(
    'teamMember/getMemberDetails',
    async ({ teamId, memberId }, { rejectWithValue }) => {
        try {
            const member = await teamMemberService.getMemberDetails(teamId, memberId);
            return member;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAvailableUsersForTeam = createAsyncThunk(
    'teamMember/getAvailableUsersForTeam',
    async (teamId, { rejectWithValue }) => {
        try {
            const users = await teamMemberService.getAvailableUsersForTeam(teamId);
            return users;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    members: [],
    currentMember: null,
    loading: false,
    error: null,
    availableUsers: []
};

const teamMemberSlice = createSlice({
    name: 'teamMember',
    initialState,
    reducers: {
        setCurrentMember: (state, action) => {
            state.currentMember = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Add Member
            .addCase(addMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMember.fulfilled, (state, action) => {
                state.loading = false;
                state.members.push(action.payload);
            })
            .addCase(addMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove Member
            .addCase(removeMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeMember.fulfilled, (state, action) => {
                state.loading = false;
                state.members = state.members.filter(
                    member => !(member.teamId === action.payload.teamId && member.id === action.payload.memberId)
                );
                if (state.currentMember?.id === action.payload.memberId) {
                    state.currentMember = null;
                }
            })
            .addCase(removeMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Member Title
            .addCase(updateMemberTitle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMemberTitle.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.members.findIndex(member => member.id === action.payload.id);
                if (index !== -1) {
                    state.members[index] = action.payload;
                }
                if (state.currentMember?.id === action.payload.id) {
                    state.currentMember = action.payload;
                }
            })
            .addCase(updateMemberTitle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Team Members
            .addCase(getTeamMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTeamMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(getTeamMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Member Details
            .addCase(getMemberDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMemberDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentMember = action.payload;
            })
            .addCase(getMemberDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Available Users for Team
            .addCase(getAvailableUsersForTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAvailableUsersForTeam.fulfilled, (state, action) => {
                state.loading = false;
                state.availableUsers = action.payload;
            })
            .addCase(getAvailableUsersForTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setCurrentMember, clearError } = teamMemberSlice.actions;
export default teamMemberSlice.reducer; 