using System;
using TasklyAPI.Entities;
using TasklyAPI.Enums;

namespace TasklyAPI.Entities
{
    public class TeamMembers : BaseModel
    {
        public Guid TeamId { get; set; }
        public Guid UserId { get; set; }
        public TasklyAPI.Enums.TeamMemberTitle Title { get; set; }
        public Teams Team { get; set; }
        public Users User { get; set; }
    }
}