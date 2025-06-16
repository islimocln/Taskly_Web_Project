import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Grid, TextField, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import { fetchTasks, createTask, updateTask, deleteTask, setCurrentTask, updateTaskStatus } from '../store/slices/taskSlice';
import { fetchProjects } from '../store/slices/projectSlice';
import { fetchUsers } from '../store/slices/userSlice';
import { TASK_STATUS } from '../constants/TaskStatus';
import { TASK_PRIORITIES } from '../constants/TaskPriorities';

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error, currentTask } = useSelector(state => state.tasks);
  const { projects } = useSelector(state => state.projects);
  const { users } = useSelector(state => state.users);

  // UI state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      (task.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handlers
  const handleAdd = () => {
    dispatch(setCurrentTask(null));
    setFormOpen(true);
  };
  const handleEdit = (task) => {
    dispatch(setCurrentTask(task));
    setFormOpen(true);
  };
  const handleFormClose = () => {
    setFormOpen(false);
    dispatch(setCurrentTask(null));
  };
  const handleFormSubmit = async (form) => {
    console.log('GÖREV OLUŞTURMA FORMU:', JSON.stringify(form, null, 2));
    if (currentTask) {
      await dispatch(updateTask({
        ...form,
        id: currentTask.id
      }));
      dispatch(fetchTasks());
      setSnackbar({ open: true, message: 'Görev güncellendi', severity: 'success' });
    } else {
      await dispatch(createTask(form));
      dispatch(fetchTasks());
      setSnackbar({ open: true, message: 'Görev oluşturuldu', severity: 'success' });
    }
    setFormOpen(false);
    dispatch(setCurrentTask(null));
  };
  const handleDelete = (id) => setDeleteDialog({ open: true, id });
  const handleDeleteConfirm = async () => {
    await dispatch(deleteTask(deleteDialog.id));
    setSnackbar({ open: true, message: 'Görev silindi', severity: 'success' });
    setDeleteDialog({ open: false, id: null });
  };
  const handleDeleteCancel = () => setDeleteDialog({ open: false, id: null });
  const handleStatusChange = async (task) => {
    const newStatus = task.status === 3 ? 1 : 3;
    await dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
    dispatch(fetchTasks());
  };

  return (
    <Box sx={{ bgcolor: '#f5faff', minHeight: '100vh', p: 0 }}>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Görevler</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>Yeni Görev</Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Görev ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
        />
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Durum</InputLabel>
          <Select value={statusFilter} label="Durum" onChange={e => setStatusFilter(e.target.value)}>
            <MenuItem value="">Tümü</MenuItem>
            {TASK_STATUS.map(s => (
              <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Öncelik</InputLabel>
          <Select value={priorityFilter} label="Öncelik" onChange={e => setPriorityFilter(e.target.value)}>
            <MenuItem value="">Tümü</MenuItem>
            {TASK_PRIORITIES.map(p => (
              <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <Typography>Yükleniyor...</Typography>
      ) : error ? (
        <Alert severity="error">{typeof error === 'string' ? error : error?.message || 'Bir hata oluştu'}</Alert>
      ) : (
        <Grid container spacing={2}>
          {filteredTasks.map(task => (
            <Grid item xs={12} key={task.id}>
              <TaskCard
                task={task}
                onEdit={() => handleEdit(task)}
                onDelete={() => handleDelete(task.id)}
                onStatusChange={handleStatusChange}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <TaskForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialValues={currentTask}
        users={users}
        projects={projects}
        loading={loading}
      />
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Görev Sil</DialogTitle>
        <DialogContent>
          <Typography>Bu görevi silmek istediğinize emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>İptal</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Sil</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks; 