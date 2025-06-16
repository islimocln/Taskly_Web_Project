import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  IconButton,
  Avatar,
  CircularProgress,
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
  Paper,
  Chip
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTeamsWithMembers, updateTeam, deleteTeam, createTeam } from '../store/slices/teamSlice';
import { getAvailableUsersForTeam, addMember } from '../store/slices/teamMemberSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { TEAM_MEMBER_TITLES } from '../constants/TeamMemberTitles';

const Teams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teams, loading, error } = useSelector((state) => state.teams);
  const { availableUsers } = useSelector((state) => state.teamMember);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editTeam, setEditTeam] = useState({ id: '', name: '', description: '' });
  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTeamId, setDeleteTeamId] = useState(null);
  // Add member dialog state
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addMemberTeamId, setAddMemberTeamId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedTitle, setSelectedTitle] = useState(0);
  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  // Yeni takım modalı state
  const [createOpen, setCreateOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchTeamsWithMembers());
  }, [dispatch]);

  // Edit handlers
  const handleEditOpen = (team) => {
    setEditTeam({ id: team.id, name: team.name, description: team.description });
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);
  const handleEditSave = async () => {
    await dispatch(updateTeam({ id: editTeam.id, name: editTeam.name, description: editTeam.description }));
    setEditOpen(false);
    setSnackbar({ open: true, message: 'Takım güncellendi', severity: 'success' });
    dispatch(fetchTeamsWithMembers());
  };

  // Delete handlers
  const handleDeleteOpen = (teamId) => {
    setDeleteTeamId(teamId);
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => setDeleteOpen(false);
  const handleDeleteConfirm = async () => {
    await dispatch(deleteTeam(deleteTeamId));
    setDeleteOpen(false);
    setSnackbar({ open: true, message: 'Takım silindi', severity: 'success' });
    dispatch(fetchTeamsWithMembers());
  };

  // Add member handlers
  const handleAddMemberOpen = (teamId) => {
    setAddMemberTeamId(teamId);
    setAddMemberOpen(true);
    dispatch(getAvailableUsersForTeam(teamId));
    setSelectedUserId('');
    setSelectedTitle(0);
  };
  const handleAddMemberClose = () => setAddMemberOpen(false);
  const handleAddMemberSave = async () => {
    if (!selectedUserId) return;
    await dispatch(addMember({ teamId: addMemberTeamId, memberData: { userId: selectedUserId, title: selectedTitle } }));
    setAddMemberOpen(false);
    setSnackbar({ open: true, message: 'Üye eklendi', severity: 'success' });
    dispatch(fetchTeamsWithMembers());
  };

  const handleViewTeam = (teamId) => {
    navigate(`/team-detail/${teamId}`);
  };

  const getTitleColor = (titleValue) => {
    switch (titleValue) {
      case 1: return 'primary'; // Takım Lideri
      case 2: return 'success'; // Geliştirici
      case 3: return 'warning'; // Test Uzmanı
      case 4: return 'info';    // Tasarımcı
      case 5: return 'secondary'; // Analist
      case 6: return 'error';   // Ürün Sahibi
      case 7: return 'primary'; // Scrum Master
      case 8: return 'success'; // DevOps Uzmanı
      case 9: return 'default'; // Stajyer
      case 10: return 'secondary'; // Yazılım Mimarı
      default: return 'default';
    }
  };

  // Yeni takım modalı handler
  const handleCreateOpen = () => setCreateOpen(true);
  const handleCreateClose = () => setCreateOpen(false);
  const handleCreateSave = async () => {
    if (!newTeam.name.trim()) return;
    setCreateLoading(true);
    await dispatch(createTeam({ name: newTeam.name.trim(), description: newTeam.description.trim() }));
    setCreateLoading(false);
    setCreateOpen(false);
    setNewTeam({ name: '', description: '' });
    setSnackbar({ open: true, message: 'Takım oluşturuldu', severity: 'success' });
    dispatch(fetchTeamsWithMembers());
  };

  return (
    <Box sx={{ p: 3 }}>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {typeof snackbar.message === 'string' ? snackbar.message : snackbar.message?.message || 'Bir hata oluştu'}
        </Alert>
      </Snackbar>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Takımlar
        </Typography>
        <Button variant="contained" onClick={handleCreateOpen}>Yeni Takım</Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{typeof error === 'string' ? error : error?.message || 'Bir hata oluştu'}</Typography>
      ) : (
        <Grid container spacing={3}>
          {teams.map((team) => (
            <Grid item xs={12} key={team.id}>
              <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', p: 3, borderRadius: 3, boxShadow: 3 }}>
                {/* Sol: Takım Bilgileri */}
                <Box sx={{ minWidth: 260, maxWidth: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center', pr: 4 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                    {team.name}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 15 }}>
                    {team.description}
                  </Typography>
                </Box>
                {/* Sağ: Üyeler */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {team.members && team.members.length > 0 ? (
                    team.members.map((member) => (
                      <Paper key={member.id} elevation={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1.5, minWidth: 110, maxWidth: 140, borderRadius: 2, boxShadow: 6, mr: 1, mb: 1 }}>
                        <Avatar
                          src={member.profilePhoto ? `data:image/png;base64,${member.profilePhoto}` : undefined}
                          sx={{ width: 40, height: 40, mb: 1, bgcolor: 'grey.300', color: 'primary.main', fontWeight: 700 }}
                        >
                          {(!member.profilePhoto && member.name) ? member.name[0] : ''}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'center', mb: 0.5, wordBreak: 'break-word' }}>
                          {member.name} {member.surname}
                        </Typography>
                        <Chip
                          label={TEAM_MEMBER_TITLES.find(t => t.value === member.title)?.label || ''}
                          color={getTitleColor(member.title)}
                          size="small"
                          sx={{ fontWeight: 600, mt: 0.5 }}
                        />
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">Üye yok</Typography>
                  )}
                  {/* Sağdaki aksiyon ikonları */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, ml: 3 }}>
                    {/* <IconButton color="primary" onClick={() => handleViewTeam(team.id)}>
                      <VisibilityIcon />
                    </IconButton> */}
                    <IconButton color="info" onClick={() => handleEditOpen(team)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteOpen(team.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton color="success" onClick={() => handleAddMemberOpen(team.id)}>
                      <PersonAddIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xs" fullWidth>
        <DialogTitle>Takımı Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            label="Takım Adı"
            fullWidth
            margin="normal"
            value={editTeam.name}
            onChange={e => setEditTeam({ ...editTeam, name: e.target.value })}
          />
          <TextField
            label="Açıklama"
            fullWidth
            margin="normal"
            value={editTeam.description}
            onChange={e => setEditTeam({ ...editTeam, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>İptal</Button>
          <Button variant="contained" onClick={handleEditSave}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose} maxWidth="xs">
        <DialogTitle>Takımı Sil</DialogTitle>
        <DialogContent>
          <Typography>Bu takımı silmek istediğinize emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>İptal</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Sil</Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={addMemberOpen} onClose={handleAddMemberClose} maxWidth="xs" fullWidth>
        <DialogTitle>Üye Ekle</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Kullanıcı</InputLabel>
            <Select
              value={selectedUserId}
              label="Kullanıcı"
              onChange={e => setSelectedUserId(e.target.value)}
            >
              {availableUsers.length === 0 && <MenuItem value="" disabled>Uygun kullanıcı yok</MenuItem>}
              {availableUsers.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} {user.surname} ({user.username})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Unvan</InputLabel>
            <Select
              value={selectedTitle}
              label="Unvan"
              onChange={e => setSelectedTitle(e.target.value)}
            >
              {TEAM_MEMBER_TITLES.map(title => (
                <MenuItem key={title.value} value={title.value}>{title.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddMemberClose}>İptal</Button>
          <Button variant="contained" onClick={handleAddMemberSave} disabled={!selectedUserId}>Ekle</Button>
        </DialogActions>
      </Dialog>

      {/* Yeni takım modalı */}
      <Dialog open={createOpen} onClose={handleCreateClose} maxWidth="xs" fullWidth>
        <DialogTitle>Yeni Takım Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            label="Takım Adı"
            fullWidth
            margin="normal"
            value={newTeam.name}
            onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
            required
            inputProps={{ maxLength: 100 }}
            helperText="2-100 karakter"
          />
          <TextField
            label="Açıklama"
            fullWidth
            margin="normal"
            value={newTeam.description}
            onChange={e => setNewTeam({ ...newTeam, description: e.target.value })}
            inputProps={{ maxLength: 500 }}
            helperText="En fazla 500 karakter"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>İptal</Button>
          <Button variant="contained" onClick={handleCreateSave} disabled={!newTeam.name.trim() || createLoading}>
            {createLoading ? 'Oluşturuluyor...' : 'Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Teams; 