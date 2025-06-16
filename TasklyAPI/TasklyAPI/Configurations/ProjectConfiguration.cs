using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TasklyAPI.Entities;

namespace TasklyAPI.Configurations
{
    public class ProjectConfiguration : IEntityTypeConfiguration<Projects>
    {
        public void Configure(EntityTypeBuilder<Projects> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(p => p.Description)
                .HasMaxLength(1000);

            builder.Property(p => p.Status)
                .IsRequired();


            builder.HasMany(p => p.ProjectDocuments)
                .WithOne(pd => pd.Project)
                .HasForeignKey(pd => pd.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(p => p.ProjectTeams)
                .WithOne(pt => pt.Project)
                .HasForeignKey(pt => pt.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 