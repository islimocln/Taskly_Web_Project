import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container, Grid, Paper, IconButton, Stack, TextField, InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import firatLogo from '../assets/fıratüniv.png';

const usageCases = [
  {
    title: 'Görev Yönetimi',
    description: 'Tüm görevlerinizi kolayca oluşturun, takip edin ve yönetin.',
    icon: <AssignmentIcon sx={{ fontSize: 40, color: '#1976d2' }} />, color: '#e3f2fd'
  },
  {
    title: 'Takım Çalışması',
    description: 'Projelerinizi ekip arkadaşlarınızla birlikte yönetin.',
    icon: <GroupIcon sx={{ fontSize: 40, color: '#43a047' }} />, color: '#e8f5e9'
  },
  {
    title: 'Zaman Çizelgesi',
    description: 'Projelerinizin ilerlemesini zaman çizelgesiyle izleyin.',
    icon: <TimelineIcon sx={{ fontSize: 40, color: '#fbc02d' }} />, color: '#fffde7'
  },
  {
    title: 'Belge Paylaşımı',
    description: 'Projelerinizle ilgili belgeleri güvenle paylaşın.',
    icon: <DescriptionIcon sx={{ fontSize: 40, color: '#8e24aa' }} />, color: '#f3e5f5'
  }
];

const features = [
  { icon: <CheckCircleIcon color="primary" />, title: 'Gelen Kutusu', desc: 'Tüm görev ve mesajlarınız tek yerde.' },
  { icon: <CheckCircleIcon color="primary" />, title: 'Planlayıcı', desc: 'Takviminizi senkronize edin, odaklanın.' },
  { icon: <CheckCircleIcon color="primary" />, title: 'Otomasyon', desc: 'Tekrarlayan işleri otomatikleştirin.' },
  { icon: <CheckCircleIcon color="primary" />, title: 'Entegrasyonlar', desc: 'Favori uygulamalarınızla entegre edin.' },
  { icon: <CheckCircleIcon color="primary" />, title: 'Şablonlar', desc: 'Hazır şablonlarla hızlı başlayın.' },
  { icon: <CheckCircleIcon color="primary" />, title: 'Power-Up\'lar', desc: 'Ekstra özelliklerle gücünü artır.' }
];

const companies = [
  { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png' },
  { name: 'Zoom', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg' },
  { name: 'Fırat Üniversitesi', logo: firatLogo },
 
];

const testimonials = [
  {
    quote: 'Taskly, ekibimizin verimliliğini %40 artırdı!',
    author: 'Ayşe Yılmaz',
    company: 'Acme Corp'
  },
  {
    quote: 'Projelerimizi yönetmek hiç bu kadar kolay olmamıştı.',
    author: 'Mehmet Demir',
    company: 'Beta Yazılım'
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#e3f2fd', minHeight: '100vh' }}>
      {/* Navbar */}
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: '#fff',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
          borderBottom: '1.5px solid #f3f6f9',
          py: 0.5
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              letterSpacing: 1,
              fontSize: 24,
              cursor: 'pointer',
              px: 1.5,
              borderRadius: 2,
              transition: 'background 0.18s',
              '&:hover': {
                background: '#f3f6f9'
              }
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Taskly
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {[
              { label: 'Özellikler', onClick: () => window.scrollTo({ top: 700, behavior: 'smooth' }) },
              { label: 'Kullanım Senaryoları', onClick: () => window.scrollTo({ top: 1200, behavior: 'smooth' }) },
              { label: 'Ücretlendirme', onClick: () => navigate('/pricing') },
              { label: 'Taskly101', onClick: () => navigate('/taskly101') },
              { label: 'Giriş Yap', onClick: () => navigate('/login') }
            ].map((item, idx) => (
              <Button
                key={item.label}
                onClick={item.onClick}
                sx={{
                  fontWeight: 500,
                  fontSize: 16,
                  color: 'primary.main',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  background: 'transparent',
                  boxShadow: 'none',
                  transition: 'all 0.18s',
                  border: '2px solid transparent',
                  '&:hover': {
                    background: '#f3f6f9',
                    color: '#1565c0',
                    borderColor: '#1976d2',
                    boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/signup')}
              sx={{
                fontWeight: 600,
                fontSize: 16,
                px: 3,
                py: 1.2,
                borderRadius: 3,
                boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.13)',
                ml: 1,
                transition: 'all 0.18s',
                '&:hover': {
                  transform: 'scale(1.06)',
                  boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.18)'
                }
              }}
            >
              Kayıt Ol
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '2.2rem', md: '2.8rem' } }}>
              Takımınızla Üretkenliği Zirveye Taşıyın
            </Typography>
            <Typography variant="h5" color="text.secondary" mb={4} sx={{ fontSize: { xs: '1.1rem', md: '1.4rem' } }}>
              Taskly ile projelerinizi, görevlerinizi ve ekibinizi tek bir yerden yönetin. Hemen başlayın, üretkenliği artırın!
            </Typography>
            <Button variant="contained" size="large" color="primary" onClick={() => navigate('/signup')} sx={{ px: 5, py: 1.5, fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.10)' }}>
              Hemen Başla - Ücretsiz!
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
                alt="Taskly Hero"
                style={{ width: '100%', maxWidth: 1200, borderRadius: 24, boxShadow: '0 8px 32px rgba(25,118,210,0.10)' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Şirketler / Sponsorlar */}
      <Container sx={{ py: 4 }}>
        <Typography variant="subtitle1" color="text.secondary" align="center" mb={2}>
          Dünya çapında binlerce ekip Taskly'ye güveniyor
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2, sm: 4, md: 6 },
            flexWrap: 'wrap',
            py: 2,
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 4,
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.06)'
          }}
        >
          {companies.map((c, i) => (
            <Box
              key={i}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 100,
                minHeight: 60,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.08)' }
              }}
            >
              <img
                src={c.logo}
                alt={c.name}
                style={{
                  height: 48,
                  maxWidth: 120,
                  objectFit: 'contain',
                  filter: 'grayscale(0.2) brightness(0.95)'
                }}
              />
            </Box>
          ))}
        </Box>
      </Container>

      {/* Kullanım Senaryoları */}
      <Container sx={{ py: 6 }}>
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
                <Box mb={2} sx={{ fontSize: 48 }}>{feature.icon}</Box>
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

      {/* Özellikler */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={600} textAlign="center" mb={6}>
          Taskly'nin Temel Özellikleri
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 5,
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  border: '2.5px solid #f3f6f9',
                  transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
                  '&:hover': {
                    transform: 'scale(1.04)',
                    boxShadow: '0 8px 32px 0 rgba(25,118,210,0.13)',
                    borderColor: '#1976d2'
                  }
                }}
              >
                <Box sx={{ fontSize: 32, color: '#1976d2', mr: 1 }}>{f.icon}</Box>
                <Box>
                  <Typography fontWeight={700} sx={{ color: '#222' }}>{f.title}</Typography>
                  <Typography color="text.secondary" fontSize={15}>{f.desc}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Kullanıcı Yorumları */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={600} textAlign="center" mb={6}>
          Kullanıcılarımız Ne Diyor?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {testimonials.map((t, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <StarIcon sx={{ color: '#FFD700', fontSize: 32 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  "{t.quote}"
                </Typography>
                <Typography color="text.secondary">
                  — {t.author}, {t.company}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* E-posta ile Kayıt CTA */}
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          Taskly ile hemen işe koyulun
        </Typography>
        <Typography color="text.secondary" mb={4}>
          E-posta adresinizi girerek hemen ücretsiz başlayın!
        </Typography>
        <Box sx={{ maxWidth: 400, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="E-posta"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: '#fff', borderRadius: 2 }}
          />
          <Button variant="contained" color="primary" size="large" sx={{ mt: 2, width: '100%', fontWeight: 600 }}>
            Kaydolun - Ücretsizdir!
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#f3f6f9', py: 4 }}>
        <Container>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'space-between' }}>
            <Box sx={{ minWidth: 200, mb: 2 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Taskly
              </Typography>
              <Typography>Takım çalışmasını kolaylaştıran modern proje yönetimi aracı.</Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <IconButton color="inherit" sx={{ '&:hover': { color: '#1976d2', bgcolor: '#fff' } }}><FacebookIcon /></IconButton>
                <IconButton color="inherit" sx={{ '&:hover': { color: '#1976d2', bgcolor: '#fff' } }}><TwitterIcon /></IconButton>
                <IconButton color="inherit" sx={{ '&:hover': { color: '#1976d2', bgcolor: '#fff' } }}><LinkedInIcon /></IconButton>
              </Box>
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
    </Box>
  );
} 