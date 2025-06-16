import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../services/task.service';

// Async thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
    try {
        const data = await taskService.getAllTasks();
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const createTask = createAsyncThunk('tasks/createTask', async (task, { rejectWithValue }) => {
    try {
        const data = await taskService.createTask(task);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (task, { rejectWithValue }) => {
    try {
        const data = await taskService.updateTask(task.id, task);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
    try {
        await taskService.deleteTask(id);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateTaskStatus = createAsyncThunk(
    'tasks/updateTaskStatus',
    async ({ taskId, status }, { rejectWithValue }) => {
        try {
            const task = await taskService.updateTaskStatus(taskId, status);
            return task;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    tasks: [],
    currentTask: null,
    loading: false,
    error: null
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setCurrentTask: (state, action) => {
            state.currentTask = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.unshift(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.tasks.findIndex(t => t.id === action.payload.id);
                if (idx !== -1) state.tasks[idx] = action.payload;
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(t => t.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Task Status
            .addCase(updateTaskStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(updateTaskStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setCurrentTask, clearError } = taskSlice.actions;
export default taskSlice.reducer; 