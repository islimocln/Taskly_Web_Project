using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TasklyAPI.Enums;

namespace TasklyAPI.DTOs.TaskDTOs
{
    public class UpdateTaskDto
    {
        [Required(ErrorMessage = "Görev ID'si zorunludur.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Proje ID'si zorunludur.")]
        public Guid ProjectId { get; set; }

        [Required(ErrorMessage = "Başlık zorunludur.")]
        [StringLength(100, ErrorMessage = "Başlık en fazla 100 karakter olabilir.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Açıklama zorunludur.")]
        [StringLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Durum zorunludur.")]
        public TasklyAPI.Enums.TaskStatus Status { get; set; }

        public DateTime? DueDate { get; set; }

        [Required(ErrorMessage = "Öncelik zorunludur.")]
        public TaskPriority Priority { get; set; }

        [Required(ErrorMessage = "En az bir atanmış kişi zorunludur.")]
        [MaxLength(2, ErrorMessage = "Bir göreve en fazla 2 kişi atanabilir.")]
        [MinLength(1, ErrorMessage = "En az bir kişi atanmalıdır.")]
        public List<Guid> AssignedUserIds { get; set; }
    }
} 