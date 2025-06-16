using System.Collections.Generic;
using System.Threading.Tasks;
using TasklyAPI.DTOS;
using TasklyAPI.Entities;

namespace TasklyAPI.Services
{
    public interface INotificationService
    {
        Task<List<Notification>> GetUserNotifications(string userId);
        Task CreateNotification(NotificationDto dto);
        Task MarkAsRead(int id);
        Task DeleteNotification(int id);
    }
} 