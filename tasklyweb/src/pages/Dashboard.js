import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  LinearProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import axios from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });

  const stats = [
    { title: 'Aktif Projeler', value: '5', icon: '📁' },
    { title: 'Açık Görevler', value: '8', icon: '✓' },
    { title: 'Bugün Son Tarihli', value: '3', icon: '⏰' },
  ];

  // Yeni: Proje ve görev ilerleme state'i
  const [projects, setProjects] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [showProjects, setShowProjects] = useState(true);

  useEffect(() => {
    axios.get('/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      const data = await Promise.all(projects.slice(0, 3).map(async (project) => {
        const res = await axios.get(`/tasks?projectId=${project.id}`);
        const tasks = res.data;
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 3).length; // 3 = Tamamlandı
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { name: project.name, progress };
      }));
      setProgressData(data);
    };
    if (projects.length > 0) fetchProgress();
  }, [projects]);

  const quickActions = [
    { title: 'Yeni Proje', icon: <AddIcon />, action: () => navigate('/projects', { state: { openNewProject: true } }) },
    { title: 'Yeni Görev', icon: <EditIcon />, action: () => navigate('/tasks') },
    { title: 'Döküman Yükle', icon: <UploadIcon />, action: () => navigate('/documents') },
    { title: 'Takım Oluştur', icon: <GroupIcon />, action: () => navigate('/teams') },
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, width: '100%', maxWidth: 'none', mx: 0 }}>
      {/* Header Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p: 3, 
        borderRadius: 2,
        mb: 3 
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Ana Sayfa</Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
        </Box>
        <Typography variant="h3" sx={{ mt: 2 }}>Hoş geldin, İslim!</Typography>
        <Typography variant="subtitle1">{currentDate}</Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center',
              bgcolor: 'background.paper',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <Typography variant="h3" sx={{ mb: 1 }}>{stat.icon}</Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>{stat.value}</Typography>
              <Typography variant="body1" color="text.secondary">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Son Projeler ve Görevler Progress */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">{showProjects ? 'Son Projeler' : 'Son Görevler'}</Typography>
            <Box>
              {!showProjects && (
                <IconButton onClick={() => setShowProjects(true)}>
                  <ArrowBackIosNewIcon />
                </IconButton>
              )}
              {showProjects && (
                <IconButton onClick={() => setShowProjects(false)}>
                  <ArrowForwardIosIcon />
                </IconButton>
              )}
            </Box>
          </Box>
          {showProjects ? (
            progressData.map((project, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">{project.name}</Typography>
                  <Typography variant="body2" color="primary">
                    {project.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.100',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    }
                  }}
                />
              </Box>
            ))
          ) : (
            <Typography color="text.secondary" align="center">Buraya görev ilerlemesi eklenebilir.</Typography>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Typography variant="h6" sx={{ mb: 2 }}>Hızlı Eylemler</Typography>
      <Grid container spacing={2}>
        {quickActions.map((action, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
              }}
              onClick={action.action}
            >
              <IconButton
                sx={{
                  bgcolor: 'primary.light',
                  color: 'white',
                  mb: 1,
                  '&:hover': { bgcolor: 'primary.main' },
                }}
              >
                {action.icon}
              </IconButton>
              <Typography variant="body2">{action.title}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 