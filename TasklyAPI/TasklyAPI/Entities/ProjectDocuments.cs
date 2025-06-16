using System;
using System.ComponentModel.DataAnnotations.Schema;
using TasklyAPI.Entities;

namespace TasklyAPI.Entities
{
    public class ProjectDocuments:BaseModel
    {
        public Guid ProjectId { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        
        public byte[] FileContent { get; set; }
        public DateTime UploadedAt { get; set; }
        public string Description {  get; set; }
        public Guid UploadedByUserId { get; set; }
        public Projects Project { get; set; }
        public Users UploadedByUser { get; set; }
        public Guid? DeletedByUserId { get; set; }
        [NotMapped]
        public Users DeletedByUser { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? UpdatedByUserId { get; set; }
        [NotMapped]
        public Users UpdatedByUser { get; set; }
        public long FileSize { get; set; }
    } 
}