import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';

const plans = [
  {
    title: 'ÜCRETSİZ',
    price: '0',
    currency: '₺',
    period: 'ay',
    description: 'Çalışma Alanı başına 10 birlikte çalışan kişiye kadar ücretsiz',
    features: [
      'Yapılacakları not edin, organize olun ve işleri halledin.'
    ],
    highlighted: false
  },
  {
    title: 'STANDART',
    price: '49',
    currency: '₺',
    period: 'ay',
    description: 'Kullanıcı başına aylık ücret, yıllık olarak faturalandırılır.',
    features: [
      'Sınırsız pano, kart yansıtma ve daha fazla otomasyon ile daha fazla işi tamamlayın.'
    ],
    highlighted: false
  },
  {
    title: 'PREMIUM',
    price: '99',
    currency: '₺',
    period: 'ay',
    description: 'Kullanıcı başına aylık ücret, yıllık olarak faturalandırılır.',
    features: [
      'Panolarınıza AI ve araç setinize yönetici kontrollerini ekleyin.',
      'Ayrıca görünümlerle daha fazla perspektif elde edin.'
    ],
    highlighted: true
  },
  {
    title: 'ENTERPRISE',
    price: '199',
    currency: '₺',
    period: 'ay',
    description: 'Kullanıcı başına aylık ücret, yıllık olarak faturalandırılır.',
    features: [
      'Kurumsal düzeyde güvenlik ve kontroller ekleyin.',
      '7/24 Kurumsal Yönetici desteği dahildir.'
    ],
    highlighted: false
  }
];

export default function Pricing() {
  return (
    <Box sx={{ bgcolor: '#fafbfc', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="md" sx={{ pt: 10, pb: 4 }}>
        <Typography variant="h3" fontWeight={700} align="center" gutterBottom>
          Taskly'yi kendi istediğiniz şekilde kullanın.
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" mb={6}>
          Milyonlarca kişinin güvendiği Taskly, dünyanın her yerindeki takımlara güç katıyor.<br />
          Size en uygun seçeneği keşfedin.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, idx) => (
            <Grid item xs={12} sm={6} md={3} key={plan.title}>
              <Paper
                elevation={plan.highlighted ? 8 : 2}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: plan.highlighted ? '2.5px solid #1976d2' : '2px solid #e3e6ea',
                  boxShadow: plan.highlighted ? '0 8px 32px 0 rgba(25,118,210,0.13)' : '0 2px 12px 0 rgba(0,0,0,0.04)',
                  background: plan.highlighted ? 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)' : '#fff',
                  transform: plan.highlighted ? 'scale(1.04)' : 'none',
                  transition: 'all 0.18s',
                  position: 'relative',
                  zIndex: plan.highlighted ? 2 : 1
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} color={plan.highlighted ? 'primary.main' : 'text.primary'} gutterBottom>
                  {plan.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                  <Typography variant="h3" fontWeight={700} color={plan.highlighted ? 'primary.main' : 'text.primary'}>
                    {plan.currency}{plan.price}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ ml: 0.5, mb: 0.5 }}>
                    /{plan.period}
                  </Typography>
                </Box>
                <Typography color="text.secondary" fontSize={15} mb={2}>
                  {plan.description}
                </Typography>
                <ul style={{ paddingLeft: 18, marginBottom: 18 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ marginBottom: 8, color: '#222', fontSize: 15 }}>{f}</li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? 'contained' : 'outlined'}
                  color="primary"
                  fullWidth
                  sx={{ mt: 2, fontWeight: 600, py: 1.2, borderRadius: 2 }}
                >
                  {plan.highlighted ? 'Hemen Başla' : 'Seç'}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
} 