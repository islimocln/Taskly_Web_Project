using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using TasklyAPI.Entities;

namespace TasklyAPI.Entities
{
    public class Users:BaseModel
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        public byte[]? ProfilePicture { get; set; }

        public ICollection<TeamMembers> TeamMemberships { get; set; }
        public ICollection<ProjectDocuments> UploadedProjectDocuments { get; set; }
        public ICollection<TaskAssignments> AssignedTasks { get; set; }
    }
}
