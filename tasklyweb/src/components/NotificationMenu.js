import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Menu, MenuItem, ListItemText, Typography, Box, Divider, CircularProgress } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, deleteNotification } from '../store/slices/notificationSlice';
import notificationService from '../services/notification.service';

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { items: notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications(user.id));
      const interval = setInterval(() => {
        dispatch(fetchNotifications(user.id));
      }, 10000); // 10 saniyede bir
      return () => clearInterval(interval);
    }
  }, [user, dispatch]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleDeleteNotification = async (id) => {
    await dispatch(deleteNotification(id));
  };

  return (
    <>
      <IconButton color="inherit" onClick={e => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            minWidth: 340,
            maxHeight: 420,
            bgcolor: '#f7f9fb',
            borderRadius: 3,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            p: 0,
          }
        }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e0e3e7', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <Typography variant="subtitle1" fontWeight={700} color="primary.main">Bildirimler</Typography>
        </Box>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {!loading && notifications.length === 0 && (
          <Box sx={{ px: 3, py: 2, color: 'text.secondary', textAlign: 'center' }}>
            Hiç bildiriminiz yok.
          </Box>
        )}
        {!loading && notifications.map((n) => (
          <Box
            key={n.id}
            sx={{
              position: 'relative',
              bgcolor: n.isRead ? '#f7f9fb' : '#e3f2fd',
              borderRadius: 2,
              m: 2,
              mb: 1,
              boxShadow: n.isRead ? 'none' : '0 2px 8px 0 rgba(33, 150, 243, 0.08)',
              p: 2,
              transition: 'background 0.2s',
              border: n.isRead ? '1px solid #e0e3e7' : '1.5px solid #2196f3',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5
            }}
          >
            <IconButton
              size="small"
              sx={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}
              onClick={() => handleDeleteNotification(n.id)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
              {n.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(n.createdAt).toLocaleString('tr-TR')}
            </Typography>
          </Box>
        ))}
      </Menu>
    </>
  );
};

export default NotificationMenu; 