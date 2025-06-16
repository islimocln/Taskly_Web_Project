import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Grid, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import InfoIcon from '@mui/icons-material/Info';

const user = {
  name: 'İslim',
  surname: 'Öcalan',
  email: 'islim@example.com',
  role: 'Üye',
  bio: 'Taskly platformunda aktif bir üyeyim. Proje yönetimi ve takım çalışmasında deneyimliyim.'
};

const Profile = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: { xs: 4, md: 10 }
      }}
    >
      <Card
        sx={{
          minWidth: 350,
          maxWidth: 420,
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          p: 3,
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 110,
              height: 110,
              fontSize: 48,
              bgcolor: 'primary.main',
              border: '4px solid #fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            {user.name[0]}
          </Avatar>
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 700 }}>
            {user.name} {user.surname}
          </Typography>
          <Divider sx={{ width: 60, my: 1, bgcolor: 'primary.main', borderBottomWidth: 3, borderRadius: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <EmailIcon color="primary" />
            <Typography color="text.secondary" fontSize={16}>{user.email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <BadgeIcon color="primary" />
            <Typography color="primary" fontWeight={500} fontSize={16}>{user.role}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <InfoIcon color="primary" />
            <Typography variant="body1" color="text.secondary" align="center">
              {user.bio}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile; 