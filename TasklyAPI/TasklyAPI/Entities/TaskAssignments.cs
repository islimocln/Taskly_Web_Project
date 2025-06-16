using System;
using TasklyAPI.Entities;

namespace TasklyAPI.Entities
{
    public class TaskAssignments:BaseModel
{
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }

        public Tasks Task { get; set; }
        public Users User { get; set; }
    } 
}