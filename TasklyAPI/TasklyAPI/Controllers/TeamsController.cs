using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasklyAPI.DTOS.TeamDTOs;
using TasklyAPI.Entities;
using TasklyAPI.Context;
using Microsoft.EntityFrameworkCore;

namespace TasklyAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TeamsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeamsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTeam([FromBody] CreateTeamDTO createTeamDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var team = new Teams
            {
                Name = createTeamDTO.Name,
                Description = createTeamDTO.Description
            };

            await _context.Teams.AddAsync(team);
            await _context.SaveChangesAsync();

            return Ok(team);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTeams()
        {
            var teams = await _context.Teams.Where(t => !t.IsDeleted).ToListAsync();
            return Ok(teams);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTeamById(Guid id)
        {
            var team = await _context.Teams.FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);
            if (team == null)
                return NotFound();
            return Ok(team);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTeam([FromBody] UpdateTeamDTO updateTeamDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var team = await _context.Teams.FirstOrDefaultAsync(t => t.Id == updateTeamDTO.Id && !t.IsDeleted);
            if (team == null)
                return NotFound();

            team.Name = updateTeamDTO.Name;
            team.Description = updateTeamDTO.Description;
            await _context.SaveChangesAsync();
            return Ok(team);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeam(Guid id)
        {
            var team = await _context.Teams.FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);
            if (team == null)
                return NotFound();
            team.IsDeleted = true;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Takım başarıyla silindi." });
        }
    }
} 