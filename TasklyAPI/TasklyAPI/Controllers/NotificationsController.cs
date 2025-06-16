using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TasklyAPI.DTOS;
using TasklyAPI.Services;

namespace TasklyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserNotifications(string userId)
        {
            var notifications = await _notificationService.GetUserNotifications(userId);
            return Ok(notifications);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] NotificationDto dto)
        {
            await _notificationService.CreateNotification(dto);
            return Ok();
        }

        [HttpPost("read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            await _notificationService.MarkAsRead(id);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            await _notificationService.DeleteNotification(id);
            return Ok();
        }
    }
} 