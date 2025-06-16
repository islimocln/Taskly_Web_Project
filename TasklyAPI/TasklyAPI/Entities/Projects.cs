using System;
using System.Collections.Generic;
using TasklyAPI.Enums;

namespace TasklyAPI.Entities
{
    public class Projects:BaseModel
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? DeletedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public ProjectStatus Status { get; set; }
        public ICollection<ProjectDocuments> ProjectDocuments { get; set; } = new List<ProjectDocuments>();
        public ICollection<ProjectTeams> ProjectTeams { get; set; } = new List<ProjectTeams>();
        public int Progress { get; set; } = 0;
    }
}
