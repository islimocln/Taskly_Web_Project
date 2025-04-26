namespace TasklyAPI.Entities
{
    using System.ComponentModel.DataAnnotations;
    using TasklyAPI.Model;

    public class User : BaseModel
    {
        [Required]
        [StringLength(200)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string Surname { get; set; }

       
        public string PasswordHash { get; set; }

        public byte[]? ProfilePicture { get; set; }


        [StringLength(50)]
        public string? Role { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
