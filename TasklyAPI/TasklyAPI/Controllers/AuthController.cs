using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.ComponentModel.DataAnnotations;
using TasklyAPI.Context;
using TasklyAPI.DTOS;
using TasklyAPI.Entities;
using TasklyAPI;

namespace TasklyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PasswordService _passwordService;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, PasswordService passwordService, IConfiguration configuration)
        {
            _context = context;
            _passwordService = passwordService;
            _configuration = configuration;
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:SecretKey"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("userId", user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role ?? "user")
        }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDto signUpDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz model");

            var emailValidation = new EmailAddressAttribute();
            if (!emailValidation.IsValid(signUpDto.Email))
                return BadRequest("Geçersiz e-posta adresi.");

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == signUpDto.Email);
            if (existingUser != null)
                return BadRequest("Bu e-posta adresi zaten kullanımda.");

            var baseUsername = $"{signUpDto.Surname}.{signUpDto.Name}".ToLower();
            var username = baseUsername;
            int counter = 1;

            while (await _context.Users.AnyAsync(u => u.Username == username))
            {
                username = $"{baseUsername}{counter}";
                counter++;
            }

            var user = new User
            {
                Name = signUpDto.Name,
                Surname = signUpDto.Surname,
                Email = signUpDto.Email,
                Username = username,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
            };

            var hashedPassword = _passwordService.HashPassword(user, signUpDto.Password);
            user.PasswordHash = hashedPassword;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Kullanıcı başarıyla kaydedildi. Lütfen giriş yapınız.",
                username = user.Username
            });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz model");

            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Email.ToLower() == loginDto.EmailOrUsername.ToLower() ||
                    u.Username.ToLower() == loginDto.EmailOrUsername.ToLower());

            if (user == null)
                return Unauthorized("Kullanıcı bulunamadı.");

            var isPasswordValid = _passwordService.VerifyPassword(user, user.PasswordHash, loginDto.Password);

            if (!isPasswordValid)
                return Unauthorized("Şifre hatalı.");

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                message = "Giriş başarılı",
                username = user.Username,
                token = token
            });
        }
    }
}