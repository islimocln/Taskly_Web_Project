using System.ComponentModel.DataAnnotations;

namespace TasklyAPI.DTOS.ProjectTeamDTOs
{
    public class CreateProjectTeamDTO
    {
        [Required]
        public Guid ProjectId { get; set; }
        [Required]
        public Guid TeamId { get; set; }
    }
} 