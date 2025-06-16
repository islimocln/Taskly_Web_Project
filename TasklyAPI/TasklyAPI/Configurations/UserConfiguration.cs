using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TasklyAPI.Entities;

namespace TasklyAPI.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<Users>
    {
        public void Configure(EntityTypeBuilder<Users> builder)
        {
            builder.HasKey(u => u.Id);

            builder.Property(u => u.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.Surname)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.PasswordHash)
                .IsRequired();

            builder.Property(u => u.Role)
                .IsRequired()
                .HasMaxLength(20);

            // Relationships
            builder.HasMany(u => u.TeamMemberships)
                .WithOne(tm => tm.User)
                .HasForeignKey(tm => tm.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.UploadedProjectDocuments)
                .WithOne(pd => pd.UploadedByUser)
                .HasForeignKey(pd => pd.UploadedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.AssignedTasks)
                .WithOne(ta => ta.User)
                .HasForeignKey(ta => ta.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 