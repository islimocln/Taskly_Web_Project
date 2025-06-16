using System.ComponentModel.DataAnnotations;

namespace TasklyAPI.DTOS.TeamDTOs
{
    public class CreateTeamDTO
    {
        [Required(ErrorMessage = "Takım adı zorunludur.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Takım adı 2-100 karakter arasında olmalıdır.")]
        public string Name { get; set; }

        [StringLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir.")]
        public string? Description { get; set; }
    }
} 