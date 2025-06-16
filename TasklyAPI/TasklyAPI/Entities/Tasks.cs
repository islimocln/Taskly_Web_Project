using System;
using System.Collections.Generic;
using TasklyAPI.Entities;

namespace TasklyAPI.Entities
{
    public class Tasks:BaseModel
    {
    public Guid ProjectId { get; set; }
    public string? Title { get; set; }
    public string Description { get; set; }
    public TasklyAPI.Enums.TaskStatus Status { get; set; }
    public DateTime? DueDate { get; set; }
    public TasklyAPI.Enums.TaskPriority Priority { get; set; }
    public Projects Project { get; set; }
    public ICollection<TaskAssignments> TaskAssignments { get; set; }
    }
}