using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TasklyAPI.Entities;

namespace TasklyAPI.Entities
{
    public class Teams:BaseModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<TeamMembers> TeamMembers { get; set; }
        public ICollection<ProjectTeams> ProjectTeams { get; set; }
    }
} 