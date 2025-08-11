using Microsoft.EntityFrameworkCore;

namespace Balance.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Balance> Balances { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Receipt> Receipts { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<ResourceReciept> ResourceReciepts { get; set; }
        public DbSet<Shipment> Shipments { get; set; }
        public DbSet<ShipmentResource> ShipmentResources { get; set; }
        public DbSet<Unit> Units { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Resource>()
                .HasIndex(r => r.Name)
                .IsUnique();

            modelBuilder.Entity<Unit>()
                .HasIndex(u => u.Name)
                .IsUnique();

            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.Name)
                .IsUnique();

            modelBuilder.Entity<Receipt>()
                .HasIndex(r => r.PurchaseOrder)
                .IsUnique();
            
            modelBuilder.Entity<Shipment>()
                .HasIndex(r => r.PurchaseOrder)
                .IsUnique();
        }
    }
}