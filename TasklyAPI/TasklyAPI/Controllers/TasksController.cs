using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TasklyAPI.Context;
using TasklyAPI.DTOs.TaskDTOs;
using TasklyAPI.Entities;
using TasklyAPI.Services;

namespace TasklyAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private const int MaxAssignedUsers = 2;

        public TasksController(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [HttpPost]
        public async Task<ActionResult<TaskResponseDto>> CreateTask(CreateTaskDto dto)
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

                var project = await _context.Projects.FindAsync(dto.ProjectId);
                if (project == null)
                {
                    return NotFound("Proje bulunamadı.");
                }


                if (dto.AssignedUserIds.Count > MaxAssignedUsers)
                {
                    return BadRequest($"Bir göreve en fazla {MaxAssignedUsers} kişi atanabilir.");
                }

                // DueDate'i UTC olarak ayarla
                DateTime? dueDate = null;
                if (dto.DueDate.HasValue)
                {
                    dueDate = dto.DueDate.Value.Kind == DateTimeKind.Unspecified
                        ? DateTime.SpecifyKind(dto.DueDate.Value, DateTimeKind.Utc)
                        : dto.DueDate.Value.ToUniversalTime();
                }

                var task = new Tasks
                {
                    ProjectId = dto.ProjectId,
                    Title = dto.Title,
                    Description = dto.Description,
                    Status = dto.Status,
                    DueDate = dueDate,
                    Priority = dto.Priority,
                };

                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();

                foreach (var assignedUserId in dto.AssignedUserIds)
                {
                    var assignment = new TaskAssignments
                    {
                        TaskId = task.Id,
                        UserId = assignedUserId,
                    };
                    _context.TaskAssignments.Add(assignment);
                }

                await _context.SaveChangesAsync();

                // Bildirim: Görev ataması
                foreach (var assignedUserId in dto.AssignedUserIds)
                {
                    await _notificationService.CreateNotification(new TasklyAPI.DTOS.NotificationDto
                    {
                        UserId = assignedUserId.ToString(),
                        Message = $"'{task.Title}' adlı görev size atandı.",
                        Type = "Task",
                        RelatedId = task.Id.ToString()
                    });
                }

                var response = await GetTaskWithDetails(task.Id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message ?? "";
                return StatusCode(500, $"Görev oluşturulurken bir hata oluştu: {ex.Message} {inner}");
            }
        }

        [HttpPut]
        public async Task<ActionResult<TaskResponseDto>> UpdateTask(UpdateTaskDto dto)
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

                var task = await _context.Tasks
                    .Include(t => t.TaskAssignments)
                    .FirstOrDefaultAsync(t => t.Id == dto.Id && !t.IsDeleted);

                if (task == null)
                {
                    return NotFound("Görev bulunamadı.");
                }


                if (dto.AssignedUserIds.Count > MaxAssignedUsers)
                {
                    return BadRequest($"Bir göreve en fazla {MaxAssignedUsers} kişi atanabilir.");
                }

                // DueDate'i UTC olarak ayarla
                DateTime? dueDate = null;
                if (dto.DueDate.HasValue)
                {
                    dueDate = dto.DueDate.Value.Kind == DateTimeKind.Unspecified
                        ? DateTime.SpecifyKind(dto.DueDate.Value, DateTimeKind.Utc)
                        : dto.DueDate.Value.ToUniversalTime();
                }
                task.DueDate = dueDate;

                task.Title = dto.Title;
                task.Description = dto.Description;
                task.Status = dto.Status;
                task.Priority = dto.Priority;

                _context.TaskAssignments.RemoveRange(task.TaskAssignments);

                foreach (var assignedUserId in dto.AssignedUserIds)
                {
                    var assignment = new TaskAssignments
                    {
                        TaskId = task.Id,
                        UserId = assignedUserId,
                    };
                    _context.TaskAssignments.Add(assignment);
                }

                await _context.SaveChangesAsync();

                var response = await GetTaskWithDetails(task.Id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message ?? "";
                return StatusCode(500, $"Görev güncellenirken bir hata oluştu: {ex.Message} {inner}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
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

                var task = await _context.Tasks
                    .Include(t => t.Project)
                    .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);

                if (task == null)
                {
                    return NotFound("Görev bulunamadı.");
                }

                task.IsDeleted = true;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Görev başarıyla silindi." });
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message ?? "";
                return StatusCode(500, $"Görev silinirken bir hata oluştu: {ex.Message} {inner}");
            }
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetTasksByProject(Guid projectId)
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

                var project = await _context.Projects.FindAsync(projectId);
                if (project == null)
                {
                    return NotFound("Proje bulunamadı.");
                }


                var tasks = await _context.Tasks
                    .Include(t => t.TaskAssignments)
                        .ThenInclude(ta => ta.User)
                    .Where(t => t.ProjectId == projectId && !t.IsDeleted)
                    .OrderByDescending(t => t.CreatedAt)
                    .Select(t => new TaskResponseDto
                    {
                        Id = t.Id,
                        ProjectId = t.ProjectId,
                        Title = t.Title,
                        Description = t.Description,
                        Status = t.Status,
                        DueDate = t.DueDate,
                        Priority = t.Priority,
                        Assignments = t.TaskAssignments.Select(ta => new TaskAssignmentDto
                        {
                            UserId = ta.UserId,
                            UserName = ta.User.Name,
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message ?? "";
                return StatusCode(500, $"Görevler listelenirken bir hata oluştu: {ex.Message} {inner}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskResponseDto>> GetTaskWithDetails(Guid id)
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

                var task = await _context.Tasks
                    .Include(t => t.TaskAssignments)
                        .ThenInclude(ta => ta.User)
                    .Where(t => t.Id == id && !t.IsDeleted)
                    .Select(t => new TaskResponseDto
                    {
                        Id = t.Id,
                        ProjectId = t.ProjectId,
                        Title = t.Title,
                        Description = t.Description,
                        Status = t.Status,
                        DueDate = t.DueDate,
                        Priority = t.Priority,
                        Assignments = t.TaskAssignments.Select(ta => new TaskAssignmentDto
                        {
                            UserId = ta.UserId,
                            UserName = ta.User.Name,
                        }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (task == null)
                {
                    return NotFound("Görev bulunamadı.");
                }

                return Ok(task);
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message ?? "";
                return StatusCode(500, $"Görev detayları alınırken bir hata oluştu: {ex.Message} {inner}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _context.Tasks
                .Include(t => t.TaskAssignments)
                    .ThenInclude(ta => ta.User)
                .Include(t => t.Project)
                .Where(t => !t.IsDeleted)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new
                {
                    t.Id,
                    t.ProjectId,
                    ProjectName = t.Project.Name,
                    t.Title,
                    t.Description,
                    t.Status,
                    t.DueDate,
                    t.Priority,
                    Assignments = t.TaskAssignments.Select(ta => new {
                        ta.UserId,
                        UserName = ta.User.Name
                    }).ToList()
                })
                .ToListAsync();

            return Ok(tasks);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateTaskStatus(Guid id, [FromBody] UpdateTaskStatusDto dto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return NotFound();

            task.Status = (TasklyAPI.Enums.TaskStatus)dto.Status;
            await _context.SaveChangesAsync();

            // Eğer task bir projeye bağlıysa, proje ilerlemesini güncelle
            if (task.ProjectId != Guid.Empty)
            {
                var projectTasks = _context.Tasks.Where(t => t.ProjectId == task.ProjectId).ToList();
                int total = projectTasks.Count;
                int completed = projectTasks.Count(t => t.Status == TasklyAPI.Enums.TaskStatus.Tamamlandi);
                int progress = total > 0 ? (int)Math.Round((double)completed / total * 100) : 0;

                var project = await _context.Projects.FindAsync(task.ProjectId);
                if (project != null)
                {
                    project.Progress = progress;
                    await _context.SaveChangesAsync();
                }
            }

            return NoContent();
        }
    }
} 