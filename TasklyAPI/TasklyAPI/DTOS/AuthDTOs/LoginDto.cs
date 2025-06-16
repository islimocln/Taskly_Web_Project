using System.ComponentModel.DataAnnotations;

namespace TasklyAPI.DTOS
{
    public class LoginDto
    {
        [Required(ErrorMessage = "E-posta veya kullanıcı adı zorunludur.")]
        public string EmailOrUsername { get; set; }

        [Required(ErrorMessage = "Şifre zorunludur.")]
        public string Password { get; set; }
    }
}