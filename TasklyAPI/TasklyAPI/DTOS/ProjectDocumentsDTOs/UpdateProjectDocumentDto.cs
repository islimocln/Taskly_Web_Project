using System.ComponentModel.DataAnnotations;

namespace TasklyAPI.DTOs.ProjectDocumentsDTOs
{
    public class UpdateProjectDocumentDto
    {
        [Required(ErrorMessage = "Doküman ID'si zorunludur.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Proje ID'si zorunludur.")]
        public Guid ProjectId { get; set; }

        public IFormFile? File { get; set; }

        [Required(ErrorMessage = "Açıklama zorunludur.")]
        [StringLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir.")]
        public string Description { get; set; }
    }
} 