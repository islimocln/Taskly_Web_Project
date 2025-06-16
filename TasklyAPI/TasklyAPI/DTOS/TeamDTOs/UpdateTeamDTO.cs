using System.ComponentModel.DataAnnotations;

namespace TasklyAPI.DTOS.TeamDTOs
{
    public class UpdateTeamDTO
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }
    }
}