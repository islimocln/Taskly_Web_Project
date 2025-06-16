using System;
using System.ComponentModel.DataAnnotations;
using TasklyAPI.Enums;

namespace TasklyAPI.DTOS.TeamMemberDTOs
{
    public class AddTeamMemberDTO
    {
        [Required]
        public Guid TeamId { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public TeamMemberTitle Title { get; set; }
    }
} 