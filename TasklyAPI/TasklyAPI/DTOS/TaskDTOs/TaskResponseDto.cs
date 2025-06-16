using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TasklyAPI.Enums;

namespace TasklyAPI.DTOs.TaskDTOs
{
    public class TaskResponseDto
    {
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public TasklyAPI.Enums.TaskStatus Status { get; set; }
        public DateTime? DueDate { get; set; }
        public TaskPriority Priority { get; set; }
        public List<TaskAssignmentDto> Assignments { get; set; }
    }

    public class TaskAssignmentDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
    }
} 