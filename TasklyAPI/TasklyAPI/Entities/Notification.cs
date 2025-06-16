using System;

namespace TasklyAPI.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
        public string Type { get; set; }
        public string RelatedId { get; set; }
    }
} 