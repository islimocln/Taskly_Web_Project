import React from 'react';
import { Card, Box, Typography, Chip, Avatar, IconButton, Tooltip, Checkbox } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TASK_STATUS } from '../../constants/TaskStatus';
import { TASK_PRIORITIES } from '../../constants/TaskPriorities';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, onClick }) => {
  const statusObj = TASK_STATUS.find(s => s.value === task.status);
  const priorityObj = TASK_PRIORITIES.find(p => p.value === task.priority);

  return (
    <Card sx={{ p: 2, mb: 2, borderRadius: 3, boxShadow: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{task.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{task.description}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {statusObj && <Chip label={statusObj.label} color={statusObj.color} size="small" />}
          {priorityObj && <Chip label={priorityObj.label} color={priorityObj.color} size="small" />}
          {task.assignments && task.assignments.map(a => (
            <Chip key={a.userId} avatar={<Avatar sx={{ width: 24, height: 24 }}>{a.userName[0]}</Avatar>} label={a.userName} size="small" />
          ))}
          {task.dueDate && <Chip icon={<span role="img" aria-label="date">📅</span>} label={task.dueDate.slice(0, 10)} size="small" />}
          {task.projectName && <Chip label={task.projectName} size="small" color="primary" />}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <Checkbox
          checked={task.status === 3}
          onChange={() => onStatusChange(task)}
          color="success"
          inputProps={{ 'aria-label': 'Task tamamlandı' }}
        />
        <Tooltip title="Düzenle">
          <IconButton color="primary" size="small" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Sil">
          <IconButton color="error" size="small" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default TaskCard; 