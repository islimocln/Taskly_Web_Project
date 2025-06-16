using Microsoft.EntityFrameworkCore;
using TasklyAPI.Entities;

namespace TasklyAPI.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<Users> Users { get; set; }
        public DbSet<Teams> Teams { get; set; }
        public DbSet<TeamMembers> TeamMembers { get; set; }
        public DbSet<Projects> Projects { get; set; }
        public DbSet<ProjectTeams> ProjectTeams { get; set; }
        public DbSet<ProjectDocuments> ProjectDocuments { get; set; }
        public DbSet<Tasks> Tasks { get; set; }
        public DbSet<TaskAssignments> TaskAssignments { get; set; }
        public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
    }
}

