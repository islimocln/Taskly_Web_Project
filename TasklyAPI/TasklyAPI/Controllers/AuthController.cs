using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using TasklyAPI.Context;
using TasklyAPI.Entities;
using TasklyAPI.Services;
using TasklyAPI.DTOS;

namespace TasklyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly PasswordService _passwordService;
        private readonly TokenService _tokenService;

        public AuthController(ApplicationDbContext context, PasswordService passwordService, TokenService tokenService)
        {
            _context = context;
            _passwordService = passwordService;
            _tokenService = tokenService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDto signUpDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz model.");

            var emailValidation = new EmailAddressAttribute();
            if (!emailValidation.IsValid(signUpDto.Email))
                return BadRequest("Geçersiz e-posta adresi.");

            if (await _context.Users.AnyAsync(u => u.Email == signUpDto.Email))
                return BadRequest("Bu e-posta adresi zaten kullanımda.");

            var baseUsername = $"{signUpDto.Name}.{signUpDto.Surname}".ToLower();
            var username = baseUsername;
            int counter = 1;
            while (await _context.Users.AnyAsync(u => u.Username == username))
            {
                username = $"{baseUsername}{counter}";
                counter++;
            }

            var user = new Users
            {
                Name = signUpDto.Name,
                Surname = signUpDto.Surname,
                Email = signUpDto.Email,
                Username = username,
                CreatedAt = DateTime.UtcNow,
                Role = "Member"
            };

            user.PasswordHash = _passwordService.HashPassword(user, signUpDto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Kayıt başarılı.",
                username = user.Username,
                email = user.Email
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz model.");

            var signInInput = loginDto.EmailOrUsername.ToLower();

            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    (u.Email.ToLower() == signInInput ||
                    u.Username.ToLower() == signInInput));

            if (user == null)
                return Unauthorized("Kullanıcı bulunamadı.");


            var isPasswordValid = _passwordService.VerifyPassword(user, user.PasswordHash, loginDto.Password);

            if (!isPasswordValid)
                return Unauthorized("Şifre hatalı.");

            var token = _tokenService.GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    name = user.Name,
                    surname = user.Surname,
                    role = user.Role
                }
            });
        
        }
    }
} 