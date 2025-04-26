using System.ComponentModel.DataAnnotations;

namespace TasklyAPI.DTOS
{
    public class SignUpDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }

        [EmailAddress(ErrorMessage = "Geçersiz e-posta adresi.")]
        public string Email { get; set; }

        [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır.")]
        public string Password { get; set; }

    }
}
