import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, CircularProgress, Paper, Divider, LinearProgress, Button, Avatar, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { projectService } from '../services/project.service';
import { projectTeamService } from '../services/projectTeam.service';
import { projectDocumentService } from '../services/projectDocument.service';
import { fetchProjects } from '../store/slices/projectSlice';
import { taskService } from '../services/task.service';
import { teamMemberService } from '../services/teamMember.service';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(null);
  const [teamMembers, setTeamMembers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const proj = await projectService.getProjectById(id);
        setProject(proj);
        // Görevleri çek
        const fetchedTasks = await taskService.getTasksByProjectId(id);
        setTasks(fetchedTasks);
        // İlerleme hesapla
        if (fetchedTasks && fetchedTasks.length > 0) {
          const total = fetchedTasks.length;
          const completed = fetchedTasks.filter(t => t.status === 3).length;
          setProgress(Math.round((completed / total) * 100));
        } else {
          setProgress(null);
        }
        // Takım üyelerini çek
        if (proj.projectTeams && proj.projectTeams.length > 0) {
          const membersObj = {};
          for (const team of proj.projectTeams) {
            if (!team.deletedAt) {
              try {
                const members = await teamMemberService.getTeamMembers(team.id);
                membersObj[team.id] = members;
              } catch (e) {
                membersObj[team.id] = [];
              }
            }
          }
          setTeamMembers(membersObj);
        }
      } catch (err) {
        setError('Proje veya görevler bulunamadı ya da yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>{error}</Box>;
  if (!project) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        Geri Dön
      </Button>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InfoIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h5" fontWeight={700}>{project.name}</Typography>
        </Box>
        <Typography color="text.secondary" sx={{ mb: 2 }}>{project.description}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip label={project.statusText || 'Durum Bilinmiyor'} color="primary" size="small" />
          {project.dueDate && <Chip label={`Bitiş: ${new Date(project.dueDate).toLocaleDateString()}`} size="small" />}
          <Chip label={`Oluşturulma: ${new Date(project.createdAt).toLocaleDateString()}`} size="small" />
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* Takımlar */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}><GroupIcon sx={{ mr: 1 }} />Atanmış Takımlar</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {project.projectTeams && project.projectTeams.length > 0 ? project.projectTeams.map(team => (
            !team.deletedAt && (
              <Box key={team.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label={team.teamName || team.name} color="primary" size="small" />
                {teamMembers[team.id] && teamMembers[team.id].length > 0 && teamMembers[team.id].map(member => (
                  <Tooltip title={member.username || member.name} key={member.id}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>
                      {(member.username || member.name || '?')[0].toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Box>
            )
          )) : <Typography color="text.secondary">Takım yok</Typography>}
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* Dokümanlar */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}><DescriptionIcon sx={{ mr: 1 }} />Dokümanlar</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {project.projectDocuments && project.projectDocuments.length > 0 ? project.projectDocuments.map(doc => (
            <Chip key={doc.id} label={doc.fileName} icon={<DescriptionIcon fontSize="small" />} size="small" />
          )) : <Typography color="text.secondary">Doküman yok</Typography>}
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* Görevler ve ilerleme */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Görevler ve İlerleme</Typography>
        {progress !== null && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">Tamamlanma: {progress}%</Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, mt: 1 }} />
          </Box>
        )}
        {tasks && tasks.length > 0 ? (
          <Box>
            {tasks.map(task => (
              <Paper key={task.id} sx={{ p: 1.5, mb: 1, borderRadius: 2, bgcolor: task.status === 3 ? 'success.light' : 'grey.100' }}>
                <Typography variant="body2" fontWeight={600}>{task.title}</Typography>
                <Typography variant="caption" color="text.secondary">{task.description}</Typography>
              </Paper>
            ))}
          </Box>
        ) : <Typography color="text.secondary">Görev yok</Typography>}
      </Paper>
    </Box>
  );
};

export default ProjectDetail; 