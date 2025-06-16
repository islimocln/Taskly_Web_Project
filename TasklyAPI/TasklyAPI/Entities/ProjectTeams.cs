using System;
using TasklyAPI.Entities;

namespace TasklyAPI.Entities
{
    public class ProjectTeams:BaseModel
    {
        public Guid ProjectId { get; set; }
        public Guid TeamId { get; set; }
        public DateTime? DeletedAt { get; set; }
        public Guid CreatedByUserId { get; set; }

        public Projects Project { get; set; }
        public Teams Team { get; set; }
        public Users CreatedByUser { get; set; }
    } 
}