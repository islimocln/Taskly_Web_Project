import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Folder as FolderIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import NotificationMenu from '../NotificationMenu';

const drawerWidth = 220;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    }),
    minHeight: '100vh',
  }),
);

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Ana Sayfa', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Projeler', icon: <FolderIcon />, path: '/projects' },
    { text: 'Takımlar', icon: <GroupIcon />, path: '/teams' },
    { text: 'Görevler', icon: <AssignmentIcon />, path: '/tasks' },
    { text: 'Dökümanlar', icon: <DescriptionIcon />, path: '/documents' },
    { text: 'Profil', icon: <PersonIcon />, path: '/profile' },
    { text: 'Ayarlar', icon: <SettingsIcon />, path: '/settings' },
  ];

  // Kullanıcı adı veya e-posta baş harfi
  const avatarLetter = user?.email?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'İ';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { sm: open ? `${drawerWidth}px` : 0 },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {/* Bildirim Menüsü */}
          <NotificationMenu />
          {/* Modern UserMenu */}
          <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
              {avatarLetter}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: 3,
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                p: 1,
              },
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.email || 'Kullanıcı'}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout} sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="primary" />
              </ListItemIcon>
              Çıkış Yap
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: 'none',
            boxShadow: '0 0 10px rgba(0,0,0,0.05)',
          },
        }}
      >
        <Toolbar sx={{ px: 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}>
            Taskly
          </Typography>
        </Toolbar>
        <Divider />
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: location.pathname === item.path ? 'primary.light' : 'transparent',
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  '&:hover': {
                    bgcolor: location.pathname === item.path ? 'primary.light' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  minWidth: 40,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <Toolbar />
        <Box sx={{ p: { xs: 0.5, sm: 1, md: 2 }, pt: 2 }}>
          {children}
        </Box>
      </Main>
    </Box>
  );
};

export default MainLayout; 