using DataLayer.Models.Entities;
using DataLayer.Models.Global;
using Microsoft.EntityFrameworkCore;

namespace RepositoryLayer
{
    public class EntityContext : DbContext
    {
        public EntityContext()
        {
        }

        public EntityContext(DbContextOptions<EntityContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            modelBuilder.Entity<PatientRecords>(entity =>
            {
                entity.ToTable("PatientRecords");
                entity.Property(p => p.Id).ValueGeneratedOnAdd().HasColumnName("Id");
            });
            
            modelBuilder.Entity<TotalRecordCountGLB>(entity =>
            {
                entity.HasNoKey();
            });
        }

        #region TableEntities
        public virtual DbSet<PatientRecords> PatientRecords { get; set; } = null!;
        #endregion TableEntities

        #region  RawSQL Entity
        public DbSet<TotalRecordCountGLB> TotalRecordCountGLB { get; set; }
        #endregion RawSQL Entity

    }

}
