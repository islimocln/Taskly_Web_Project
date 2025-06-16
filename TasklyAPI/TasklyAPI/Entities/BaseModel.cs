namespace TasklyAPI.Entities
{
    public abstract class BaseModel
    {
        public BaseModel()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
            IsDeleted = false;
        }
        public Guid Id { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}