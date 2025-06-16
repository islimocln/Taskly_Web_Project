import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import DocumentCard from '../components/documents/DocumentCard';
import DocumentUpload from '../components/documents/DocumentUpload';
import { fetchDocuments, uploadDocument, deleteDocument } from '../store/slices/documentSlice';
import { fetchProjects } from '../store/slices/projectSlice';

const Documents = () => {
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector(state => state.documents);
  const { projects } = useSelector(state => state.projects);

  // UI state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchDocuments());
    dispatch(fetchProjects());
  }, [dispatch]);

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch =
      doc.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter ? doc.fileType === typeFilter : true;
    return matchesSearch && matchesType;
  });

  // Handlers
  const handleUploadOpen = () => setUploadOpen(true);
  const handleUploadClose = () => setUploadOpen(false);
  const handleUploadSubmit = async (formData) => {
    await dispatch(uploadDocument(formData));
    setSnackbar({ open: true, message: 'Doküman yüklendi', severity: 'success' });
    setUploadOpen(false);
    dispatch(fetchDocuments());
  };
  const handleDelete = (id) => setDeleteDialog({ open: true, id });
  const handleDeleteConfirm = async () => {
    await dispatch(deleteDocument(deleteDialog.id));
    setSnackbar({ open: true, message: 'Doküman silindi', severity: 'success' });
    setDeleteDialog({ open: false, id: null });
    dispatch(fetchDocuments());
  };
  const handleDeleteCancel = () => setDeleteDialog({ open: false, id: null });
  const handleDownload = async (doc) => {
    try {
      const response = await fetch(`/api/ProjectDocuments/download/${doc.id}`, {
        method: 'GET',
        // authentication gerekiyorsa header ekleyebilirsin
      });
      if (!response.ok) throw new Error('Dosya indirilemedi');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('İndirme sırasında hata oluştu: ' + err.message);
    }
  };

  // Benzersiz dosya türleri
  const fileTypes = Array.from(new Set(documents.map(d => d.fileType))).filter(Boolean);

  return (
    <Box sx={{ bgcolor: '#f5faff', minHeight: '100vh', p: 0 }}>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Dökümanlar</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleUploadOpen}>Döküman Yükle</Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Döküman ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
        />
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Tür</InputLabel>
          <Select value={typeFilter} label="Tür" onChange={e => setTypeFilter(e.target.value)}>
            <MenuItem value="">Tümü</MenuItem>
            {fileTypes.map(type => (
              <MenuItem key={type} value={type}>{type.toUpperCase().replace('.', '')}</MenuItem>
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
          {filteredDocs.map(doc => (
            <Grid item xs={12} key={doc.id}>
              <DocumentCard
                document={doc}
                onDownload={() => handleDownload(doc)}
                onDelete={() => handleDelete(doc.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <DocumentUpload
        open={uploadOpen}
        onClose={handleUploadClose}
        onSubmit={handleUploadSubmit}
        projects={projects}
        loading={loading}
      />
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Doküman Sil</DialogTitle>
        <DialogContent>
          <Typography>Bu dokümanı silmek istediğinize emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>İptal</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Sil</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Documents; 