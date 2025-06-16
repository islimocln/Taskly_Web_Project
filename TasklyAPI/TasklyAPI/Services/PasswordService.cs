namespace TasklyAPI.Services
{
    using Microsoft.AspNetCore.Identity;
    using TasklyAPI.Entities;

    public class PasswordService
    {
        private readonly PasswordHasher<Users> _hasher = new();

        public string HashPassword(Users user, string password)
        {
            return _hasher.HashPassword(user, password);
        }

        public bool VerifyPassword(Users user, string hashedPassword, string providedPassword)
        {
            var result = _hasher.VerifyHashedPassword(user, hashedPassword, providedPassword);
            return result == PasswordVerificationResult.Success;
        }
    }
}
