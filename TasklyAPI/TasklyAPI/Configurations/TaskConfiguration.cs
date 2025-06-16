using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TasklyAPI.Entities;

namespace TasklyAPI.Configurations
{
    public class TaskConfiguration : IEntityTypeConfiguration<Tasks>
    {
        public void Configure(EntityTypeBuilder<Tasks> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(t => t.Description)
                .HasMaxLength(1000);

            builder.Property(t => t.Status)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(t => t.Priority)
                .IsRequired();

            builder.HasOne(t => t.Project)
                .WithMany()
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(t => t.TaskAssignments)
                .WithOne(ta => ta.Task)
                .HasForeignKey(ta => ta.TaskId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 