using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TasklyAPI.Context;
using TasklyAPI.DTOs.ProjectDocumentsDTOs;
using TasklyAPI.Entities;

namespace TasklyAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectDocumentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private const int MaxFileSizeInMB = 20;
        private readonly string[] AllowedFileTypes = { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".jpg", ".jpeg", ".png" };

        public ProjectDocumentsController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDocumentResponseDto>>> GetAllDocuments()
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

                var documents = await _context.ProjectDocuments
                    .Include(d => d.UploadedByUser)
                    .Include(d => d.UpdatedByUser)
                    .Where(d => !d.IsDeleted)
                    .Select(d => new ProjectDocumentResponseDto
                    {
                        Id = d.Id,
                        ProjectId = d.ProjectId,
                        FileName = d.FileName,
                        FileType = d.FileType,
                        Description = d.Description,
                        UploadedAt = d.UploadedAt,
                        UploadedByUserId = d.UploadedByUserId,
                        UploadedByUserName = d.UploadedByUser.Name,
                        UpdatedAt = d.UpdatedAt,
                        UpdatedByUserId = d.UpdatedByUserId,
                        UpdatedByUserName = d.UpdatedByUser != null ? d.UpdatedByUser.Name : null,
                        FileSize = d.FileContent.Length
                    })
                    .OrderByDescending(d => d.UploadedAt)
                    .ToListAsync();

                return Ok(documents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Dokümanlar listelenirken bir hata oluştu: {ex.Message}");
            }
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ProjectDocumentResponseDto>>> GetDocumentsByProject(Guid projectId)
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


                var documents = await _context.ProjectDocuments
                    .Include(d => d.UploadedByUser)
                    .Include(d => d.UpdatedByUser)
                    .Where(d => d.ProjectId == projectId && !d.IsDeleted)
                    .Select(d => new ProjectDocumentResponseDto
                    {
                        Id = d.Id,
                        ProjectId = d.ProjectId,
                        FileName = d.FileName,
                        FileType = d.FileType,
                        Description = d.Description,
                        UploadedAt = d.UploadedAt,
                        UploadedByUserId = d.UploadedByUserId,
                        UploadedByUserName = d.UploadedByUser.Name,
                        UpdatedAt = d.UpdatedAt,
                        UpdatedByUserId = d.UpdatedByUserId,
                        UpdatedByUserName = d.UpdatedByUser != null ? d.UpdatedByUser.Name : null,
                        FileSize = d.FileContent.Length
                    })
                    .OrderByDescending(d => d.UploadedAt)
                    .ToListAsync();

                return Ok(documents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Dokümanlar listelenirken bir hata oluştu: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateProjectDocument([FromForm] CreateProjectDocumentDto dto)
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

                if (dto.File == null || dto.File.Length == 0)
                {
                    return BadRequest("Dosya yüklenemedi.");
                }

                if (dto.File.Length > MaxFileSizeInMB * 1024 * 1024)
                {
                    return BadRequest($"Dosya boyutu {MaxFileSizeInMB}MB'dan büyük olamaz.");
                }

                var fileExtension = Path.GetExtension(dto.File.FileName).ToLowerInvariant();
                if (!AllowedFileTypes.Contains(fileExtension))
                {
                    return BadRequest($"Desteklenmeyen dosya tipi. İzin verilen tipler: {string.Join(", ", AllowedFileTypes)}");
                }

                using (var memoryStream = new MemoryStream())
                {
                    await dto.File.CopyToAsync(memoryStream);
                    var fileContent = memoryStream.ToArray();

                    var document = new ProjectDocuments
                    {
                        ProjectId = dto.ProjectId,
                        FileName = dto.File.FileName,
                        FileType = fileExtension,
                        FileContent = fileContent,
                        UploadedAt = DateTime.UtcNow,
                        UploadedByUserId = userId,
                        IsDeleted = false,
                        Description = dto.Description,
                        FileSize = fileContent.Length
                    };

                    _context.ProjectDocuments.Add(document);
                    await _context.SaveChangesAsync();

                    return Ok(new { 
                        message = "Doküman başarıyla yüklendi.",
                        documentId = document.Id,
                        fileName = document.FileName,
                        fileType = document.FileType,
                        uploadedAt = document.UploadedAt
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Doküman yüklenirken bir hata oluştu: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectDocument(Guid id)
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

                var document = await _context.ProjectDocuments
                    .Include(d => d.Project)
                    .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

                if (document == null)
                {
                    return NotFound("Doküman bulunamadı.");
                }

                document.IsDeleted = true;

                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Doküman başarıyla silindi.",
                    documentId = document.Id,
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Doküman silinirken bir hata oluştu: {ex.Message}");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProjectDocument([FromForm] UpdateProjectDocumentDto dto)
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

                var document = await _context.ProjectDocuments
                    .Include(d => d.Project)
                    .FirstOrDefaultAsync(d => d.Id == dto.Id && !d.IsDeleted);

                if (document == null)
                {
                    return NotFound("Doküman bulunamadı.");
                }

                var project = await _context.Projects.FindAsync(dto.ProjectId);
                if (project == null)
                {
                    return NotFound("Proje bulunamadı.");
                }

                if (dto.File != null && dto.File.Length > 0)
                {
                    if (dto.File.Length > MaxFileSizeInMB * 1024 * 1024)
                    {
                        return BadRequest($"Dosya boyutu {MaxFileSizeInMB}MB'dan büyük olamaz.");
                    }

                    var fileExtension = Path.GetExtension(dto.File.FileName).ToLowerInvariant();
                    if (!AllowedFileTypes.Contains(fileExtension))
                    {
                        return BadRequest($"Desteklenmeyen dosya tipi. İzin verilen tipler: {string.Join(", ", AllowedFileTypes)}");
                    }

                    using (var memoryStream = new MemoryStream())
                    {
                        await dto.File.CopyToAsync(memoryStream);
                        document.FileContent = memoryStream.ToArray();
                        document.FileName = dto.File.FileName;
                        document.FileType = fileExtension;
                        document.FileSize = document.FileContent.Length;
                    }
                }

                document.ProjectId = dto.ProjectId;
                document.Description = dto.Description;
                document.UpdatedAt = DateTime.UtcNow;
                document.UpdatedByUserId = userId;

                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Doküman başarıyla güncellendi.",
                    documentId = document.Id,
                    fileName = document.FileName,
                    fileType = document.FileType,
                    updatedAt = document.UpdatedAt
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Doküman güncellenirken bir hata oluştu: {ex.Message}");
            }
        }

        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadDocument(Guid id)
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

                var document = await _context.ProjectDocuments
                    .Include(d => d.Project)
                    .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

                if (document == null)
                {
                    return NotFound("Doküman bulunamadı.");
                }

                return File(
                    document.FileContent,
                    GetContentType(document.FileType),
                    document.FileName
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Doküman indirilirken bir hata oluştu: {ex.Message}");
            }
        }

        private string GetContentType(string fileType)
        {
            return fileType.ToLower() switch
            {
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xls" => "application/vnd.ms-excel",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".txt" => "text/plain",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream"
            };
        }
    }
}