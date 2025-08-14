using Balance.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Balance.Tests.Factories
{
    public static class DbContextFactory
    {
        public static BalanceDbContext Create()
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var options = new DbContextOptionsBuilder<BalanceDbContext>()
                .UseSqlServer(
                    Environment.GetEnvironmentVariable("TEST_DB_CONNECTION") ?? config.GetConnectionString("TestsConnection")
                ).Options;

            return new BalanceDbContext(options);
        }
    }
}