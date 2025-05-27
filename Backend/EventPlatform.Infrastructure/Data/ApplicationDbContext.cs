using Microsoft.EntityFrameworkCore;
using EventPlatform.Domain.Models;

namespace EventPlatform.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Event> Events { get; set; }
    }
} 