import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Chip, Box, FormHelperText
} from '@mui/material';
import { TASK_STATUS } from '../../constants/TaskStatus';
import { TASK_PRIORITIES } from '../../constants/TaskPriorities';

const TaskForm = ({ open, onClose, onSubmit, initialValues = {}, users = [], projects = [], loading }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 1,
    priority: 2,
    assignedUserIds: [],
    dueDate: '',
    projectId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setForm({
        title: initialValues.title || '',
        description: initialValues.description || '',
        status: initialValues.status || 1,
        priority: initialValues.priority || 2,
        assignedUserIds: initialValues.assignedUserIds || [],
        dueDate: initialValues.dueDate ? initialValues.dueDate.slice(0, 10) : '',
        projectId: initialValues.projectId || ''
      });
    } else {
      setForm({
        title: '', description: '', status: 1, priority: 2, assignedUserIds: [], dueDate: '', projectId: ''
      });
    }
    setErrors({});
  }, [initialValues, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (e) => {
    const value = e.target.value;
    if (value.length <= 2) {
      setForm(prev => ({ ...prev, assignedUserIds: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Görev adı zorunludur';
    if (!form.projectId) newErrors.projectId = 'Proje seçimi zorunludur';
    if (form.assignedUserIds.length > 2) newErrors.assignedUserIds = 'En fazla 2 kişi atanabilir';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit({
      ...form,
      dueDate: form.dueDate ? form.dueDate : null
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Görev {initialValues && initialValues.id ? 'Düzenle' : 'Oluştur'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Görev Adı *"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            placeholder="Görev başlığını giriniz"
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            label="Açıklama"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            placeholder="Görev ile ilgili açıklama giriniz (opsiyonel)"
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                name="status"
                value={form.status}
                onChange={handleChange}
                label="Durum"
              >
                {TASK_STATUS.map(s => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Öncelik</InputLabel>
              <Select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                label="Öncelik"
              >
                {TASK_PRIORITIES.map(p => (
                  <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.assignedUserIds}>
            <InputLabel>Atanan Kişiler</InputLabel>
            <Select
              multiple
              name="assignedUserIds"
              value={form.assignedUserIds}
              onChange={handleUserChange}
              input={<OutlinedInput label="Atanan Kişiler" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const user = users.find(u => u.id === id);
                    return <Chip key={id} label={user ? `${user.name}${user.surname ? ' ' + user.surname : ''}` : id} />;
                  })}
                </Box>
              )}
            >
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}{user.surname ? ' ' + user.surname : ''}
                </MenuItem>
              ))}
            </Select>
            {errors.assignedUserIds && <FormHelperText>{errors.assignedUserIds}</FormHelperText>}
          </FormControl>
          <TextField
            label="Bitiş Tarihi"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            placeholder="gg.aa.yyyy"
          />
          <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.projectId} required>
            <InputLabel>Proje</InputLabel>
            <Select
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              label="Proje"
              required
            >
              <MenuItem value=""><em>Proje seçiniz</em></MenuItem>
              {projects.map(project => (
                <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
              ))}
            </Select>
            {errors.projectId && <FormHelperText>{errors.projectId}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm; 