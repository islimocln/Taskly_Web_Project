using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TasklyAPI.Context;
using System.Linq;
using System.Threading.Tasks;

namespace TasklyAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("getdetails/{userId}")]
        public async Task<IActionResult> GetDetails(Guid userId)
        {
            var user = await _context.Users
                .Include(u => u.TeamMemberships)
                    .ThenInclude(tm => tm.Team)
                        .ThenInclude(t => t.ProjectTeams)
                            .ThenInclude(pt => pt.Project)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("Kullanıcı bulunamadı.");

            var teamInfos = user.TeamMemberships
                .Where(tm => !tm.IsDeleted && tm.Team != null)
                .Select(tm => new {
                    TeamName = tm.Team.Name,
                    Title = tm.Title,
                    Projects = tm.Team.ProjectTeams
                        .Where(pt => !pt.IsDeleted && pt.Project != null)
                        .Select(pt => pt.Project.Name)
                        .Distinct()
                        .ToList()
                }).ToList();

            var result = new {
                user.Id,
                user.Name,
                user.Surname,
                user.Username,
                user.Email,
                user.Role,
                Teams = teamInfos
            };

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Where(u => !u.IsDeleted)
                .Select(u => new {
                    u.Id,
                    u.Name,
                    u.Surname,
                    u.Username,
                    u.Email
                })
                .ToListAsync();

            return Ok(users);
        }
    }
} 