using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TasklyAPI.Entities;

namespace TasklyAPI.Configurations
{
    public class TaskAssignmentConfiguration : IEntityTypeConfiguration<TaskAssignments>
    {
        public void Configure(EntityTypeBuilder<TaskAssignments> builder)
        {
            builder.HasKey(ta => ta.Id);

            // Relationships
            builder.HasOne(ta => ta.Task)
                .WithMany(t => t.TaskAssignments)
                .HasForeignKey(ta => ta.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ta => ta.User)
                .WithMany(u => u.AssignedTasks)
                .HasForeignKey(ta => ta.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 