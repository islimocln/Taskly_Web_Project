import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import TimelineIcon from '@mui/icons-material/Timeline';
import DescriptionIcon from '@mui/icons-material/Description';

const usageCases = [
  {
    title: 'Görev Yönetimi',
    description: 'Tüm görevlerinizi kolayca oluşturun, takip edin ve yönetin.',
    icon: <AssignmentIcon sx={{ fontSize: 48, color: '#1976d2' }} />, color: '#e3f2fd'
  },
  {
    title: 'Takım Çalışması',
    description: 'Projelerinizi ekip arkadaşlarınızla birlikte yönetin.',
    icon: <GroupIcon sx={{ fontSize: 48, color: '#43a047' }} />, color: '#e8f5e9'
  },
  {
    title: 'Zaman Çizelgesi',
    description: 'Projelerinizin ilerlemesini zaman çizelgesiyle izleyin.',
    icon: <TimelineIcon sx={{ fontSize: 48, color: '#fbc02d' }} />, color: '#fffde7'
  },
  {
    title: 'Belge Paylaşımı',
    description: 'Projelerinizle ilgili belgeleri güvenle paylaşın.',
    icon: <DescriptionIcon sx={{ fontSize: 48, color: '#8e24aa' }} />, color: '#f3e5f5'
  }
];

export default function Taskly101() {
  return (
    <Box sx={{ bgcolor: '#f7f8fa', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="md" sx={{ pt: 10, pb: 4 }}>
        <Typography variant="h3" fontWeight={700} align="center" gutterBottom>
          Taskly 101: Takım Çalışmasının Yeni Yolu
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" mb={6}>
          Taskly, projelerinizi ve ekiplerinizi kolayca yönetmenizi sağlayan modern bir platformdur. Görev yönetimi, takım iş birliği, zaman çizelgesi ve belge paylaşımı gibi güçlü özelliklerle işlerinizi daha verimli ve düzenli hale getirir.
        </Typography>
        <Typography variant="h4" fontWeight={600} textAlign="center" mb={6}>
          Kullanım Senaryoları
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {usageCases.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box
                sx={{
                  bgcolor: feature.color,
                  borderRadius: 5,
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                  p: 4,
                  textAlign: 'center',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  border: '2.5px solid #fff',
                  '&:hover': {
                    transform: 'scale(1.06)',
                    boxShadow: '0 8px 32px 0 rgba(25,118,210,0.18)',
                    borderColor: '#1976d2'
                  }
                }}
              >
                <Box mb={2}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#222' }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 16 }}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
} 