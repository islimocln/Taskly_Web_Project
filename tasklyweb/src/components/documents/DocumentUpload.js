import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, FormHelperText
} from '@mui/material';

const DocumentUpload = ({ open, onClose, onSubmit, projects = [], loading }) => {
  const [form, setForm] = useState({
    file: null,
    description: '',
    projectId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ file: null, description: '', projectId: '' });
    setErrors({});
  }, [open]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setForm(prev => ({ ...prev, file: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.file) newErrors.file = 'Dosya seçmelisiniz';
    if (!form.projectId) newErrors.projectId = 'Proje seçmelisiniz';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    const formData = new FormData();
    formData.append('File', form.file);
    formData.append('Description', form.description);
    formData.append('ProjectId', form.projectId);
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Doküman Yükle</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <FormControl fullWidth margin="normal" error={!!errors.file}>
            <Button variant="outlined" component="label">
              Dosya Seç
              <input type="file" name="file" hidden onChange={handleChange} />
            </Button>
            {form.file && <Box sx={{ mt: 1 }}>{form.file.name}</Box>}
            {errors.file && <FormHelperText>{errors.file}</FormHelperText>}
          </FormControl>
          <TextField
            label="Açıklama"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
            placeholder="Doküman ile ilgili açıklama (opsiyonel)"
          />
          <FormControl fullWidth margin="normal" error={!!errors.projectId} required>
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
            {loading ? 'Yükleniyor...' : 'Yükle'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DocumentUpload; 