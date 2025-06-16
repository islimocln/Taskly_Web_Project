import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => (
  <Box sx={{ bgcolor: '#172b4d', color: '#fff', py: 6, mt: 8 }}>
    <Container>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'space-between' }}>
        <Box sx={{ minWidth: 200, mb: 2 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Taskly
          </Typography>
          <Typography>Takım çalışmasını kolaylaştıran modern proje yönetimi aracı.</Typography>
        </Box>
        <Box sx={{ minWidth: 150, mb: 2 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Hakkımızda
          </Typography>
          <Typography component="a" href="#" color="inherit" sx={{ display: 'block', textDecoration: 'none', mb: 1 }}>Hakkımızda</Typography>
          <Typography component="a" href="#" color="inherit" sx={{ display: 'block', textDecoration: 'none' }}>Kariyer</Typography>
        </Box>
        <Box sx={{ minWidth: 150, mb: 2 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Destek
          </Typography>
          <Typography component="a" href="#" color="inherit" sx={{ display: 'block', textDecoration: 'none', mb: 1 }}>Yardım Merkezi</Typography>
          <Typography component="a" href="#" color="inherit" sx={{ display: 'block', textDecoration: 'none' }}>İletişim</Typography>
        </Box>
        <Box sx={{ minWidth: 150, mb: 2 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Yasal
          </Typography>
          <Typography component="a" href="#" color="inherit" sx={{ display: 'block', textDecoration: 'none', mb: 1 }}>Gizlilik Politikası</Typography>
          <Typography component="a" href="#" color="inherit" sx={{ display: 'block', textDecoration: 'none' }}>Kullanım Şartları</Typography>
        </Box>
      </Box>
      <Box mt={4} textAlign="center" color="#b0b8c1">
        © {new Date().getFullYear()} Taskly. Tüm hakları saklıdır.
      </Box>
    </Container>
  </Box>
);

export default Footer; 