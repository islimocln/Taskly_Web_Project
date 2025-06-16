import React from 'react';
import { Card, Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

const formatSize = (size) => {
  if (size > 1024 * 1024)
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  if (size > 1024)
    return (size / 1024).toFixed(1) + ' KB';
  return size + ' B';
};

const DocumentCard = ({ document, onDownload, onDelete }) => {
  return (
    <Card sx={{ p: 2, mb: 2, borderRadius: 3, boxShadow: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InsertDriveFileIcon fontSize="large" color="primary" />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{document.fileName}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
            <Chip label={document.fileType?.toUpperCase().replace('.', '')} size="small" />
            <Chip label={formatSize(document.fileSize)} size="small" />
            {document.uploadedByUserName && <Chip label={`Yükleyen: ${document.uploadedByUserName}`} size="small" />}
            {document.uploadedAt && <Chip label={`Tarih: ${document.uploadedAt.slice(0, 10)}`} size="small" />}
            {document.projectName && <Chip label={document.projectName} size="small" color="primary" />}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="İndir">
          <IconButton onClick={onDownload}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Sil">
          <IconButton color="error" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default DocumentCard; 