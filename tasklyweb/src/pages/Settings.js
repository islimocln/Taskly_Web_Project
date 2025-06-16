import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskUpdates: true,
    projectUpdates: true,
    teamMessages: true,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleNotificationChange = (setting) => {
    setNotifications({
      ...notifications,
      [setting]: !notifications[setting],
    });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePasswordChange = (field) => (event) => {
    setPassword({
      ...password,
      [field]: event.target.value,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Ayarlar
      </Typography>

      <Grid container spacing={3}>
        {/* Notifications Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Bildirim Ayarları
                </Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="E-posta Bildirimleri"
                    secondary="Önemli güncellemeler için e-posta al"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.email}
                      onChange={() => handleNotificationChange('email')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Push Bildirimleri"
                    secondary="Anlık bildirimler al"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.push}
                      onChange={() => handleNotificationChange('push')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Görev Güncellemeleri"
                    secondary="Görevlerinizdeki değişiklikler hakkında bilgilendiril"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.taskUpdates}
                      onChange={() => handleNotificationChange('taskUpdates')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Proje Güncellemeleri"
                    secondary="Projelerinizdeki değişiklikler hakkında bilgilendiril"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.projectUpdates}
                      onChange={() => handleNotificationChange('projectUpdates')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Takım Mesajları"
                    secondary="Takım üyelerinden gelen mesajlar hakkında bilgilendiril"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.teamMessages}
                      onChange={() => handleNotificationChange('teamMessages')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SecurityIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Güvenlik Ayarları
                </Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="İki Faktörlü Doğrulama"
                    secondary="Hesabınızı daha güvenli hale getirin"
                  />
                  <ListItemSecondaryAction>
                    <Switch edge="end" />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem button onClick={handleOpenDialog}>
                  <ListItemText
                    primary="Şifre Değiştir"
                    secondary="Hesap şifrenizi güncelleyin"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Oturum Geçmişi"
                    secondary="Aktif oturumlarınızı görüntüleyin"
                  />
                  <Button variant="outlined" size="small">
                    Görüntüle
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Language & Theme Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LanguageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Dil ve Tema
                </Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Dil"
                    secondary="Uygulama dilini değiştirin"
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value="tr"
                      size="small"
                    >
                      <MenuItem value="tr">Türkçe</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Tema"
                    secondary="Arayüz temasını değiştirin"
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value="light"
                      size="small"
                    >
                      <MenuItem value="light">Açık</MenuItem>
                      <MenuItem value="dark">Koyu</MenuItem>
                      <MenuItem value="system">Sistem</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Şifre Değiştir</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Mevcut Şifre"
              type="password"
              fullWidth
              value={password.current}
              onChange={handlePasswordChange('current')}
            />
            <TextField
              label="Yeni Şifre"
              type="password"
              fullWidth
              value={password.new}
              onChange={handlePasswordChange('new')}
            />
            <TextField
              label="Yeni Şifre (Tekrar)"
              type="password"
              fullWidth
              value={password.confirm}
              onChange={handlePasswordChange('confirm')}
            />
            {password.new && password.confirm && password.new !== password.confirm && (
              <Alert severity="error">
                Şifreler eşleşmiyor!
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button
            variant="contained"
            onClick={handleCloseDialog}
            disabled={!password.current || !password.new || !password.confirm || password.new !== password.confirm}
          >
            Şifreyi Değiştir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 