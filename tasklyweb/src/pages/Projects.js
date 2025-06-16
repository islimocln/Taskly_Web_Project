import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { fetchProjects, deleteProject } from '../store/slices/projectSlice';
import { projectService } from '../services/project.service';
import { projectTeamService } from '../services/projectTeam.service';
import { teamService } from '../services/team.service';
import { ProjectStatus, ProjectStatusText, ProjectStatusColor } from '../constants/projectStatus';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const Projects = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: ProjectStatus.Aktif,
    dueDate: '',
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [assignTeamDialogOpen, setAssignTeamDialogOpen] = useState(false);
  const [projectToAssignTeam, setProjectToAssignTeam] = useState(null);
  const [assignTeamIds, setAssignTeamIds] = useState([]);
  const [success, setSuccess] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', name: '', description: '', status: ProjectStatus.Aktif, dueDate: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProjects());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (location.state?.openNewProject) {
      setOpenDialog(true);
      // State'i temizle (geri gelince tekrar açılmasın diye)
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (!openDialog && isAuthenticated) {
      dispatch(fetchProjects());
    }
  }, [openDialog, isAuthenticated, dispatch]);

  useEffect(() => {
    if (openDialog) {
      teamService.getAllTeams().then(setTeams);
    }
  }, [openDialog]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getStatusColor = (status) => {
    return ProjectStatusColor[status] || 'default';
  };

  const getStatusText = (status) => {
    return ProjectStatusText[status] || 'Bilinmiyor';
  };

  const handleCreateProject = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Form validasyonu
      if (!form.name.trim()) {
        throw new Error('Proje adı boş olamaz');
      }

      if (form.name.trim().length < 3) {
        throw new Error('Proje adı en az 3 karakter olmalıdır');
      }

      if (form.name.trim().length > 200) {
        throw new Error('Proje adı en fazla 200 karakter olabilir');
      }

      if (form.description && form.description.trim().length > 1000) {
        throw new Error('Proje açıklaması en fazla 1000 karakter olabilir');
      }

      // API'ye gönderilecek veriyi hazırla
      const projectData = {
        name: form.name.trim(),
        description: form.description ? form.description.trim() : null,
        status: parseInt(form.status),
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null
      };

      // Projeyi oluştur
      const createdProject = await projectService.createProject(projectData);
      // Takım ataması
      await Promise.all(selectedTeamIds.map(teamId =>
        projectTeamService.assignTeamToProject(createdProject.id, teamId)
      ));
      dispatch(fetchProjects());
      handleCloseDialog();
      setForm({
        name: '',
        description: '',
        status: ProjectStatus.Aktif,
        dueDate: '',
      });
      setSelectedTeamIds([]);
    } catch (error) {
      console.error('Proje oluşturma hatası:', error);
      // Hata mesajını düzgün şekilde ayarla
      const errorMessage = error.response?.data?.message || error.message || 'Proje oluşturulurken bir hata oluştu';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await dispatch(deleteProject(projectToDelete.id));
      setError(null);
      setSuccess('Proje başarıyla silindi.');
      console.log('Proje başarıyla silindi.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Proje silinirken bir hata oluştu';
      setError(errorMessage);
      setSuccess(null);
      console.error('Proje silme hatası:', errorMessage, error);
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  // Dosya boyutunu formatla
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleOpenAssignTeamDialog = (project) => {
    setProjectToAssignTeam(project);
    setAssignTeamIds(project.projectTeams?.map(t => t.teamId) || []);
    setAssignTeamDialogOpen(true);
    teamService.getAllTeams().then(setTeams);
  };

  const handleAssignTeam = async () => {
    if (!projectToAssignTeam) return;
    try {
      // Önce mevcut takımları kaldır
      const currentTeamIds = projectToAssignTeam.projectTeams?.map(t => t.teamId) || [];
      const toRemove = currentTeamIds.filter(id => !assignTeamIds.includes(id));
      const toAdd = assignTeamIds.filter(id => !currentTeamIds.includes(id));
      // Kaldır
      await Promise.all(
        projectToAssignTeam.projectTeams
          .filter(pt => toRemove.includes(pt.teamId))
          .map(pt => projectTeamService.removeTeamFromProject(pt.id))
      );
      // Ekle
      await Promise.all(
        toAdd.map(teamId => projectTeamService.assignTeamToProject(projectToAssignTeam.id, teamId))
      );
      setAssignTeamDialogOpen(false);
      setProjectToAssignTeam(null);
      setAssignTeamIds([]);
      dispatch(fetchProjects());
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Takım atama hatası');
    }
  };

  const handleCloseAssignTeamDialog = () => {
    setAssignTeamDialogOpen(false);
    setProjectToAssignTeam(null);
    setAssignTeamIds([]);
  };

  const handleEditOpen = (project) => {
    setEditForm({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      dueDate: project.dueDate ? project.dueDate.slice(0, 10) : ''
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      setEditSubmitting(true);
      await projectService.updateProject(editForm.id, {
        name: editForm.name,
        description: editForm.description,
        status: parseInt(editForm.status),
        dueDate: editForm.dueDate ? new Date(editForm.dueDate).toISOString() : null
      });
      setEditDialogOpen(false);
      dispatch(fetchProjects());
      setSuccess('Proje başarıyla güncellendi.');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Proje güncellenirken bir hata oluştu');
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5faff', minHeight: '100vh', p: 0 }}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 0.5 }}>
        <Typography variant="h4" component="h1">
          Projeler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Yeni Proje
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Proje ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Durum</InputLabel>
          <Select
            value={filterStatus}
            label="Durum"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">Tümü</MenuItem>
            <MenuItem value={ProjectStatus.Aktif}>Aktif</MenuItem>
            <MenuItem value={ProjectStatus.Tamamlandi}>Tamamlandı</MenuItem>
            <MenuItem value={ProjectStatus.Beklemede}>Beklemede</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : projects?.map((project) => (
          <Grid item xs={12} key={project.id}>
            <Card sx={{ display: 'flex', alignItems: 'stretch', p: 2 }}>
              {/* Sol renkli ikon alanı */}
              <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
                <IconButton color="primary" onClick={() => navigate(`/projects/${project.id}`)}>
                  <InfoIcon />
                </IconButton>
              </Box>
              {/* Orta içerik */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {project.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {project.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  <Chip label={getStatusText(project.status)} color={getStatusColor(project.status)} size="small" />
                  {project.dueDate && (
                    <Chip label={`Bitiş: ${new Date(project.dueDate).toLocaleDateString()}`} variant="outlined" size="small" />
                  )}
                  <Chip label={`Oluşturulma: ${new Date(project.createdAt).toLocaleDateString()}`} variant="outlined" size="small" />
                </Box>
                {/* Dokümanlar */}
                {project.projectDocuments && project.projectDocuments.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {project.projectDocuments.map((doc) => (
                      <Chip
                        key={doc.id}
                        label={`${doc.fileName} (${formatFileSize(doc.fileSize)})`}
                        size="small"
                        variant="outlined"
                        icon={<DescriptionIcon fontSize="small" />}
                      />
                    ))}
                  </Box>
                )}
              </Box>
              {/* Sağ aksiyon butonları ve takım kutucukları */}
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', pl: 2, gap: 1 }}>
                {/* Takım kutucukları sağa taşındı */}
                {project.projectTeams && project.projectTeams.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                    {project.projectTeams.map((team) => (
                      !team.deletedAt && (
                        <Chip
                          key={team.id}
                          label={team.teamName || team.name}
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )
                    ))}
                  </Box>
                )}
                <IconButton color="primary" onClick={() => handleOpenAssignTeamDialog(project)}>
                  <GroupAddIcon />
                </IconButton>
                <IconButton color="primary" onClick={() => handleEditOpen(project)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteClick(project)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Proje</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Proje Adı"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={error && !form.name.trim()}
              helperText={error && !form.name.trim() ? 'Proje adı boş olamaz' : ''}
              disabled={isSubmitting}
            />
            <TextField
              label="Açıklama"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={isSubmitting}
            />
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={form.status}
                label="Durum"
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                disabled={isSubmitting}
              >
                <MenuItem value={ProjectStatus.Aktif}>Aktif</MenuItem>
                <MenuItem value={ProjectStatus.Tamamlandi}>Tamamlandı</MenuItem>
                <MenuItem value={ProjectStatus.Beklemede}>Beklemede</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Bitiş Tarihi"
              type="date"
              fullWidth
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              disabled={isSubmitting}
            />
            <FormControl fullWidth>
              <InputLabel>Takımlar</InputLabel>
              <Select
                multiple
                value={selectedTeamIds}
                onChange={e => setSelectedTeamIds(e.target.value)}
                label="Takımlar"
                renderValue={selected =>
                  selected.map(id => teams.find(t => t.id === id)?.name).join(', ')
                }
                disabled={isSubmitting}
              >
                {teams.map(team => (
                  <MenuItem key={team.id} value={team.id}>
                    <GroupIcon sx={{ mr: 1 }} />
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateProject}
            disabled={isSubmitting || !form.name.trim()}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Oluşturuluyor...' : 'Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Projeyi Sil</DialogTitle>
        <DialogContent>
          <Typography>Bu projeyi silmek istediğinize emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>İptal</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Sil</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={assignTeamDialogOpen} onClose={handleCloseAssignTeamDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Projeye Takım Ata</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Takımlar</InputLabel>
            <Select
              multiple
              value={assignTeamIds}
              onChange={e => setAssignTeamIds(e.target.value)}
              label="Takımlar"
              renderValue={selected =>
                selected.map(id => teams.find(t => t.id === id)?.name).join(', ')
              }
            >
              {teams.map(team => (
                <MenuItem key={team.id} value={team.id}>
                  <GroupIcon sx={{ mr: 1 }} />
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignTeamDialog}>İptal</Button>
          <Button onClick={handleAssignTeam} variant="contained">Ata</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Projeyi Düzenle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Proje Adı"
              name="name"
              fullWidth
              value={editForm.name}
              onChange={handleEditChange}
              disabled={editSubmitting}
            />
            <TextField
              label="Açıklama"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={editForm.description}
              onChange={handleEditChange}
              disabled={editSubmitting}
            />
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                name="status"
                value={editForm.status}
                label="Durum"
                onChange={handleEditChange}
                disabled={editSubmitting}
              >
                <MenuItem value={ProjectStatus.Aktif}>Aktif</MenuItem>
                <MenuItem value={ProjectStatus.Tamamlandi}>Tamamlandı</MenuItem>
                <MenuItem value={ProjectStatus.Beklemede}>Beklemede</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Bitiş Tarihi"
              name="dueDate"
              type="date"
              fullWidth
              value={editForm.dueDate}
              onChange={handleEditChange}
              InputLabelProps={{ shrink: true }}
              disabled={editSubmitting}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} disabled={editSubmitting}>İptal</Button>
          <Button variant="contained" onClick={handleEditSubmit} disabled={editSubmitting}>
            {editSubmitting ? 'Güncelleniyor...' : 'Güncelle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects; 