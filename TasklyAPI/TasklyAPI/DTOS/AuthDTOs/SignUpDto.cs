using System.ComponentModel.DataAnnotations;

namespace TasklyAPI.DTOS
{
    public class SignUpDto
    {
        [Required(ErrorMessage = "Ad alanı zorunludur.")]
        [StringLength(100, ErrorMessage = "Ad en fazla 100 karakter olabilir.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Soyad alanı zorunludur.")]
        [StringLength(100, ErrorMessage = "Soyad en fazla 100 karakter olabilir.")]
        public string Surname { get; set; }

        [Required(ErrorMessage = "E-posta alanı zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        [StringLength(200, ErrorMessage = "E-posta en fazla 200 karakter olabilir.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Şifre alanı zorunludur.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Şifre en az 6, en fazla 100 karakter olabilir.")]
        public string Password { get; set; }
    }
}
