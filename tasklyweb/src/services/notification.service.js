import api from '../api';

const notificationService = {
  getUserNotifications: (userId) =>
    api.get(`/notifications/user/${userId}`),

  createNotification: (data) =>
    api.post('/notifications', data),

  markAsRead: (id) =>
    api.post(`/notifications/read/${id}`),

  deleteNotification: (id) =>
    api.delete(`/notifications/${id}`)
};

export default notificationService; 