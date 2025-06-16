namespace TasklyAPI.DTOS
{
    public class NotificationDto
    {
        public string UserId { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }
        public string RelatedId { get; set; }
    }
} 