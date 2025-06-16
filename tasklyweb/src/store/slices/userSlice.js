import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/user.service';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const users = await userService.getAllUsers();
        return users;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default userSlice.reducer; 