using System;

namespace TasklyAPI.DTOS.ProjectTeamDTOs
{
    public class ProjectTeamDTO
    {
        public Guid Id { get; set; }
        public Guid TeamId { get; set; }
        public string TeamName { get; set; }
        public string TeamDescription { get; set; }
        public DateTime AssignedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public Guid CreatedByUserId { get; set; }
        public string CreatedByUserName { get; set; }
    }
} 