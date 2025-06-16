using System;

namespace TasklyAPI.DTOs.ProjectDocumentsDTOs
{
    public class ProjectDocumentResponseDto
    {
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public string Description { get; set; }
        public DateTime UploadedAt { get; set; }
        public Guid UploadedByUserId { get; set; }
        public string UploadedByUserName { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? UpdatedByUserId { get; set; }
        public string UpdatedByUserName { get; set; }
        public long FileSize { get; set; }
    }
} 