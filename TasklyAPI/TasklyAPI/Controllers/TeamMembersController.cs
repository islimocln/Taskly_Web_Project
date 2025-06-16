using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasklyAPI.DTOS.TeamMemberDTOs;
using TasklyAPI.Entities;
using TasklyAPI.Context;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TasklyAPI.Services;

namespace TasklyAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TeamMembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public TeamMembersController(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [HttpPost]
        public async Task<IActionResult> AddMember([FromBody] AddTeamMemberDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var teamExists = await _context.Teams.AnyAsync(t => t.Id == dto.TeamId && !t.IsDeleted);
            if (!teamExists)
                return NotFound("Belirtilen takım bulunamadı.");

            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
            if (!userExists)
                return NotFound("Belirtilen kullanıcı bulunamadı.");

            bool exists = await _context.TeamMembers.AnyAsync(tm => tm.TeamId == dto.TeamId && tm.UserId == dto.UserId && !tm.IsDeleted);
            if (exists)
                return Conflict("Bu kullanıcı zaten bu takıma atanmış.");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var teamMember = new TeamMembers
            {
                TeamId = dto.TeamId,
                UserId = dto.UserId,
                Title = dto.Title,
            };

            await _context.TeamMembers.AddAsync(teamMember);
            await _context.SaveChangesAsync();

            // Bildirim: Ekibe eklendi
            var team = await _context.Teams.FindAsync(dto.TeamId);
            await _notificationService.CreateNotification(new TasklyAPI.DTOS.NotificationDto
            {
                UserId = dto.UserId.ToString(),
                Message = $"'{team?.Name}' ekibine eklendiniz.",
                Type = "Team",
                RelatedId = dto.TeamId.ToString()
            });

            return Ok(new
            {
                teamMember.Id,
                teamMember.TeamId,
                teamMember.UserId,
                teamMember.Title,
                teamMember.CreatedAt
            });
        }

        [HttpGet("team/{teamId}")]
        public async Task<IActionResult> GetMembersByTeamId(Guid teamId)
        {
            var members = await _context.TeamMembers
                .Include(tm => tm.User)
                .Where(tm => tm.TeamId == teamId && !tm.IsDeleted)
                .Select(tm => new
                {
                    tm.Id,
                    tm.UserId,
                    tm.Title,
                    UserName = tm.User.Name + " " + tm.User.Surname
                })
                .ToListAsync();
            return Ok(members);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTeamMember([FromBody] UpdateTeamMemberDTO updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var member = await _context.TeamMembers.FirstOrDefaultAsync(tm => tm.Id == updateDto.Id && !tm.IsDeleted);
            if (member == null)
                return NotFound();

            member.TeamId = updateDto.TeamId;
            member.UserId = updateDto.UserId;
            member.Title = (TasklyAPI.Enums.TeamMemberTitle)updateDto.Title;
            await _context.SaveChangesAsync();
            return Ok(member);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeamMember(Guid id)
        {
            var member = await _context.TeamMembers.FirstOrDefaultAsync(tm => tm.Id == id && !tm.IsDeleted);
            if (member == null)
                return NotFound();
            member.IsDeleted = true;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Takım üyesi başarıyla silindi." });
        }

        [HttpGet("GetTeamandMemebersForTeamsCard")]
        public async Task<IActionResult> GetTeamandMemebersForTeamsCard()
        {
            var teams = await _context.Teams
                .Where(t => !t.IsDeleted)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Description,
                    Members = t.TeamMembers
                        .Where(tm => !tm.IsDeleted)
                        .Select(tm => new
                        {
                            tm.User.Id,
                            tm.User.Name,
                            tm.User.Surname,
                            tm.Title,
                            ProfilePhoto = tm.User.ProfilePicture != null ? Convert.ToBase64String(tm.User.ProfilePicture) : null
                        }).ToList()
                })
                .ToListAsync();

            return Ok(teams);
        }
        [HttpGet("team/{teamId}/available-users")]
        public async Task<IActionResult> GetAvailableUsersForTeam(Guid teamId)
        {
            var memberUserIds = await _context.TeamMembers
                .Where(tm => tm.TeamId == teamId && !tm.IsDeleted)
                .Select(tm => tm.UserId)
                .ToListAsync();

            var availableUsers = await _context.Users
                .Where(u => !u.IsDeleted && !memberUserIds.Contains(u.Id))
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Surname,
                    u.Username,
                    u.Email,
                    ProfilePhoto = u.ProfilePicture != null ? Convert.ToBase64String(u.ProfilePicture) : null
                })
                .ToListAsync();

            return Ok(availableUsers);
        }
    }
}