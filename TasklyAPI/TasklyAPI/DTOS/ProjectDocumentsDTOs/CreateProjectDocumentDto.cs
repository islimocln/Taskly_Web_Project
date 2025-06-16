using System.ComponentModel.DataAnnotations;

namespace TasklyAPI.DTOs.ProjectDocumentsDTOs
{
    public class CreateProjectDocumentDto
    {
        [Required(ErrorMessage = "Proje ID'si zorunludur.")]
        public Guid ProjectId { get; set; }

        [Required(ErrorMessage = "Dosya zorunludur.")]
        public IFormFile File { get; set; }

        [Required(ErrorMessage = "Açıklama zorunludur.")]
        [StringLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir.")]
        public string Description { get; set; }
    }
} 