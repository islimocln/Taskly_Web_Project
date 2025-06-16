using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TasklyAPI.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace TasklyAPI.Configurations
{
    public class ProjectDocumentConfiguration : IEntityTypeConfiguration<ProjectDocuments>
    {
        public void Configure(EntityTypeBuilder<ProjectDocuments> builder)
        {
            builder.HasKey(pd => pd.Id);

            builder.Property(pd => pd.FileName)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(pd => pd.FileType)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(pd => pd.FileContent)
                .IsRequired();

            // Relationships
            builder.HasOne(pd => pd.Project)
                .WithMany(p => p.ProjectDocuments)
                .HasForeignKey(pd => pd.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(pd => pd.UploadedByUser)
                .WithMany(u => u.UploadedProjectDocuments)
                .HasForeignKey(pd => pd.UploadedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(pd => pd.UpdatedByUser)
                .WithMany()
                .HasForeignKey(pd => pd.UpdatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
} 