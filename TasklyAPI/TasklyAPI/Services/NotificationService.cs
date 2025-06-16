using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TasklyAPI.Context;
using TasklyAPI.DTOS;
using TasklyAPI.Entities;

namespace TasklyAPI.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;
        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Notification>> GetUserNotifications(string userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task CreateNotification(NotificationDto dto)
        {
            var notification = new Notification
            {
                UserId = dto.UserId,
                Message = dto.Message,
                Type = dto.Type,
                RelatedId = dto.RelatedId,
                CreatedAt = System.DateTime.UtcNow,
                IsRead = false
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification != null)
            {
                notification.IsRead = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteNotification(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification != null)
            {
                _context.Notifications.Remove(notification);
                await _context.SaveChangesAsync();
            }
        }
    }
} 