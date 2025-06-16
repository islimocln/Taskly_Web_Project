import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';
import projectReducer from './slices/projectSlice';
import teamReducer from './slices/teamSlice';
import teamMemberReducer from './slices/teamMemberSlice';
import userReducer from './slices/userSlice';
import documentReducer from './slices/documentSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: taskReducer,
        projects: projectReducer,
        teams: teamReducer,
        teamMember: teamMemberReducer,
        users: userReducer,
        documents: documentReducer,
        notifications: notificationReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
}); 