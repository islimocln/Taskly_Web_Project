using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasklyAPI.DTOS.ProjectTeamDTOs;
using TasklyAPI.Entities;
using TasklyAPI.Context;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace TasklyAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectTeamsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectTeamsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> AssignTeamToProject([FromBody] CreateProjectTeamDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("Kullanıcı kimliği bulunamadı.");

            var project = await _context.Projects
                .Include(p => p.ProjectTeams)
                .FirstOrDefaultAsync(p => p.Id == dto.ProjectId && !p.IsDeleted);

            if (project == null)
                return NotFound("Belirtilen proje bulunamadı.");

            var team = await _context.Teams
                .FirstOrDefaultAsync(t => t.Id == dto.TeamId && !t.IsDeleted);

            if (team == null)
                return NotFound("Belirtilen takım bulunamadı.");

            var existingAssignment = await _context.ProjectTeams
                .FirstOrDefaultAsync(pt => pt.ProjectId == dto.ProjectId && 
                                         pt.TeamId == dto.TeamId && 
                                         !pt.IsDeleted);

            if (existingAssignment != null)
                return Conflict("Bu takım zaten bu projeye atanmış.");

            var projectTeam = new ProjectTeams
            {
                ProjectId = dto.ProjectId,
                TeamId = dto.TeamId,
                CreatedByUserId = Guid.Parse(userId)
            };

            await _context.ProjectTeams.AddAsync(projectTeam);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                projectTeam.Id,
                projectTeam.ProjectId,
                projectTeam.TeamId,
                projectTeam.CreatedAt
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveTeamFromProject(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("Kullanıcı kimliği bulunamadı.");

            var projectTeam = await _context.ProjectTeams
                .Include(pt => pt.Project)
                .FirstOrDefaultAsync(pt => pt.Id == id && !pt.IsDeleted);

            if (projectTeam == null)
                return NotFound("Proje-takım ataması bulunamadı.");

            projectTeam.IsDeleted = true;
            projectTeam.DeletedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Takım projeden başarıyla çıkarıldı.",
                projectTeam.Id,
                projectTeam.ProjectId,
                projectTeam.TeamId,
                projectTeam.DeletedAt
            });
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetTeamsByProject(Guid projectId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("Kullanıcı kimliği bulunamadı.");

            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && !p.IsDeleted);

            if (project == null)
                return NotFound("Proje bulunamadı.");

            var teams = await _context.ProjectTeams
                .Include(pt => pt.Team)
                .Include(pt => pt.CreatedByUser)
                .Where(pt => pt.ProjectId == projectId && !pt.IsDeleted)
                .Select(pt => new ProjectTeamDTO
                {
                    Id = pt.Id,
                    TeamId = pt.TeamId,
                    TeamName = pt.Team.Name,
                    TeamDescription = pt.Team.Description,
                    AssignedAt = pt.CreatedAt,
                    DeletedAt = pt.DeletedAt,
                    CreatedByUserId = pt.CreatedByUserId,
                    CreatedByUserName = pt.CreatedByUser.Name
                })
                .OrderByDescending(pt => pt.AssignedAt)
                .ToListAsync();

            return Ok(teams);
        }

        [HttpGet("project/{projectId}/members")]
        public async Task<IActionResult> GetProjectTeamMembers(Guid projectId)
        {
            try
            {
                var userIdClaim = User.FindFirst("nameid")
                                ?? User.FindFirst(ClaimTypes.NameIdentifier)
                                ?? User.FindFirst("sub")
                                ?? User.FindFirst("id");
                if (userIdClaim == null)
                {
                    return Unauthorized("Kullanıcı kimliği bulunamadı.");
                }

                var userId = Guid.Parse(userIdClaim.Value);

                var project = await _context.Projects
                    .FirstOrDefaultAsync(p => p.Id == projectId && !p.IsDeleted);

                if (project == null)
                {
                    return NotFound("Proje bulunamadı.");
                }

                var teamMembers = await _context.ProjectTeams
                    .Include(pt => pt.Team)
                        .ThenInclude(t => t.TeamMembers)
                            .ThenInclude(tm => tm.User)
                    .Where(pt => pt.ProjectId == projectId && !pt.IsDeleted)
                    .SelectMany(pt => pt.Team.TeamMembers)
                    .Where(tm => !tm.IsDeleted)
                    .Select(tm => new
                    {
                        UserId = tm.UserId,
                        Name = tm.User.Name,
                        Surname = tm.User.Surname,
                        Title = tm.Title
                    })
                    .Distinct()
                    .OrderBy(m => m.Name)
                    .ThenBy(m => m.Surname)
                    .ToListAsync();

                return Ok(teamMembers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Takım üyeleri listelenirken bir hata oluştu: {ex.Message}");
            }
        }
    }
} 