using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TasklyAPI.Entities;

namespace TasklyAPI.Configurations
{
    public class TeamMemberConfiguration : IEntityTypeConfiguration<TeamMembers>
    {
        public void Configure(EntityTypeBuilder<TeamMembers> builder)
        {
            builder.HasKey(tm => tm.Id);

            builder.Property(tm => tm.Title)
                .IsRequired();

            builder.HasOne(tm => tm.Team)
                .WithMany(t => t.TeamMembers)
                .HasForeignKey(tm => tm.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(tm => tm.User)
                .WithMany(u => u.TeamMemberships)
                .HasForeignKey(tm => tm.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 