using System.ComponentModel.DataAnnotations;

namespace TasklyAPI.DTOS.TeamMemberDTOs
{
    public class UpdateTeamMemberDTO
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public Guid TeamId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public int Title { get; set; }
    }
}