import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notification.service';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (userId) => {
    const res = await notificationService.getUserNotifications(userId);
    return res.data;
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id) => {
    await notificationService.deleteNotification(id);
    return id;
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state) => { state.loading = false; })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export default notificationSlice.reducer; 