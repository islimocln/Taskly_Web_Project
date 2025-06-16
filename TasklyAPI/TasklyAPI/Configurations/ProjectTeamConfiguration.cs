using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TasklyAPI.Entities;

namespace TasklyAPI.Configurations
{
    public class ProjectTeamConfiguration : IEntityTypeConfiguration<ProjectTeams>
    {
        public void Configure(EntityTypeBuilder<ProjectTeams> builder)
        {
            builder.HasKey(pt => pt.Id);

            // Relationships
            builder.HasOne(pt => pt.Project)
                .WithMany(p => p.ProjectTeams)
                .HasForeignKey(pt => pt.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(pt => pt.Team)
                .WithMany(t => t.ProjectTeams)
                .HasForeignKey(pt => pt.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(pt => pt.CreatedByUser)
                .WithMany()
                .HasForeignKey(pt => pt.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
} 