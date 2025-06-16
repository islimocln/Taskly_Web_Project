using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TasklyAPI.Entities;

namespace TasklyAPI.Configurations
{
    public class TeamConfiguration : IEntityTypeConfiguration<Teams>
    {
        public void Configure(EntityTypeBuilder<Teams> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(t => t.Description)
                .HasMaxLength(500);

            // Relationships
            builder.HasMany(t => t.TeamMembers)
                .WithOne(tm => tm.Team)
                .HasForeignKey(tm => tm.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(t => t.ProjectTeams)
                .WithOne(pt => pt.Team)
                .HasForeignKey(pt => pt.TeamId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 