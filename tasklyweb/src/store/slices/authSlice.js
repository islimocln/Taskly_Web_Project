import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const user = await authService.login(credentials);
            return user;
        } catch (error) {
            return rejectWithValue(error.message || 'Giriş yapılırken bir hata oluştu');
        }
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authService.signup(userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Kayıt olurken bir hata oluştu');
        }
    }
);

const initialState = {
    user: authService.getUserFromToken(),
    isAuthenticated: authService.isAuthenticated(),
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            authService.logout();
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 