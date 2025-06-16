using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TasklyAPI.Context;
using TasklyAPI.DTOs.ProjectDTOs;
using TasklyAPI.Entities;
using TasklyAPI.Services;

namespace TasklyAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public ProjectsController(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [HttpPost]
        public async Task<ActionResult<ProjectResponseDTO>> CreateProject(CreateProjectDTO dto)
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

                var project = new Projects
                {
                    Name = dto.Name,
                    Description = dto.Description,
                    Status = dto.Status,
                    DueDate = dto.DueDate,
                };

                _context.Projects.Add(project);
                await _context.SaveChangesAsync();

                // Bildirim: Proje oluşturuldu
                await _notificationService.CreateNotification(new TasklyAPI.DTOS.NotificationDto
                {
                    UserId = userId.ToString(),
                    Message = $"'{dto.Name}' adlı projeyi oluşturdunuz.",
                    Type = "Project",
                    RelatedId = project.Id.ToString()
                });

                var response = await GetProjectWithDetails(project.Id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Proje oluşturulurken bir hata oluştu: {ex.Message}");
            }
        }

        [HttpPut]
        public async Task<ActionResult<ProjectResponseDTO>> UpdateProject(UpdateProjectDTO dto)
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

                var project = await _context.Projects.FindAsync(dto.Id);
                if (project == null)
                {
                    return NotFound("Proje bulunamadı.");
                }

                project.Name = dto.Name;
                project.Description = dto.Description;
                project.Status = dto.Status;
                project.DueDate = dto.DueDate;

                await _context.SaveChangesAsync();

                var response = await GetProjectWithDetails(project.Id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Proje güncellenirken bir hata oluştu: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
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

                var project = await _context.Projects.FindAsync(id);
                if (project == null)
                {
                    return NotFound("Proje bulunamadı.");
                }

                project.IsDeleted = true;
                project.DeletedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Proje başarıyla silindi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Proje silinirken bir hata oluştu: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectResponseDTO>>> GetAllProjects()
        {
            try
            {
                var projects = await _context.Projects
                    .Where(p => !p.IsDeleted)
                    .Include(p => p.ProjectDocuments)
                    .Include(p => p.ProjectTeams)
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => new ProjectResponseDTO
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Status = p.Status,
                        DueDate = p.DueDate,
                        CreatedAt = p.CreatedAt,
                        ProjectDocuments = p.ProjectDocuments.Select(pd => new ProjectDocumentDTO
                        {
                            Id = pd.Id,
                            FileName = pd.FileName,
                            FileType = pd.FileType,
                            FileSize = pd.FileSize,
                            UploadedAt = pd.CreatedAt,
                        }).ToList(),
                        ProjectTeams = p.ProjectTeams.Select(pt => new ProjectTeamDTO
                        {
                            Id = pt.Id,
                            TeamName = pt.Team.Name,
                            AssignedAt = pt.CreatedAt,
                            DeletedAt = pt.DeletedAt
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Projeler listelenirken bir hata oluştu: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectResponseDTO>> GetProjectById(Guid id)
        {
            try
            {
                var project = await GetProjectWithDetails(id);
                if (project == null)
                {
                    return NotFound("Proje bulunamadı.");
                }

                return Ok(project);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Proje detayları alınırken bir hata oluştu: {ex.Message}");
            }
        }

        private async Task<ProjectResponseDTO> GetProjectWithDetails(Guid projectId)
        {
            return await _context.Projects
                .Include(p => p.ProjectDocuments)
                .Include(p => p.ProjectTeams)
                .Where(p => p.Id == projectId)
                .Select(p => new ProjectResponseDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Status = p.Status,
                    DueDate = p.DueDate,
                    CreatedAt = p.CreatedAt,
                    ProjectDocuments = p.ProjectDocuments.Select(pd => new ProjectDocumentDTO
                    {
                        Id = pd.Id,
                        FileName = pd.FileName,
                        FileType = pd.FileType,
                        FileSize = pd.FileSize,
                        UploadedAt = pd.CreatedAt,
                    }).ToList(),
                    ProjectTeams = p.ProjectTeams.Select(pt => new ProjectTeamDTO
                    {
                        Id = pt.Id,
                        TeamName = pt.Team.Name,
                        AssignedAt = pt.CreatedAt,
                        DeletedAt = pt.DeletedAt
                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }
    }
}
