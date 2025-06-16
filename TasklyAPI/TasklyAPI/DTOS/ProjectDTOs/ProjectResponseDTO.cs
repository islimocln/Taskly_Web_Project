using System;
using System.Collections.Generic;
using TasklyAPI.Enums;

namespace TasklyAPI.DTOs.ProjectDTOs
{
    public class ProjectResponseDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public ProjectStatus Status { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ProjectDocumentDTO> ProjectDocuments { get; set; } = new List<ProjectDocumentDTO>();
        public List<ProjectTeamDTO> ProjectTeams { get; set; } = new List<ProjectTeamDTO>();
    }

    public class ProjectDocumentDTO
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; }
        public string UploadedByUserName { get; set; }
    }

    public class ProjectTeamDTO
    {
        public Guid Id { get; set; }
        public string TeamName { get; set; }
        public DateTime AssignedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
} 