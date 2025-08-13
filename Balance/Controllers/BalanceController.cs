using Balance.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Balance.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class BalanceController : ControllerBase
    {
        private readonly BalanceDbContext _dbContext;
        private readonly ILogger<BalanceController> _logger;

        public BalanceController(ILogger<BalanceController> logger, BalanceDbContext dbContext)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<List<Models.Balance>> Get()
        {
            return await _dbContext.Balances
                .Select(b => new Models.Balance
                {
                    Id = b.Id,
                    Quantity = b.Quantity,
                    ResourceId = b.ResourceId,
                    Resource = new Resource
                    {
                        Id = b.Resource.Id,
                        Name = b.Resource.Name,
                    },
                    UnitId = b.UnitId,
                    Unit = new Unit
                    {
                        Id = b.Unit.Id,
                        Name = b.Unit.Name
                    }
                })
                .ToListAsync();
        }
    }
}