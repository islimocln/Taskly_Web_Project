using System.ComponentModel.DataAnnotations;
using TasklyAPI.Enums;

namespace TasklyAPI.DTOs.ProjectDTOs
{
    public class CreateProjectDTO
    {
        [Required(ErrorMessage = "Proje adı zorunludur.")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Proje adı 3-200 karakter arasında olmalıdır.")]
        public string Name { get; set; }

        [StringLength(1000, ErrorMessage = "Proje açıklaması en fazla 1000 karakter olabilir.")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Proje durumu zorunludur.")]
        public ProjectStatus Status { get; set; }

        public DateTime DueDate { get; set; }
    }
} 