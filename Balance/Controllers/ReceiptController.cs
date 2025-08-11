using Balance.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Balance.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class ReceiptController : ControllerBase
    {
        private readonly BalanceDbContext _dbContext;
        private readonly ILogger<ReceiptController> _logger;

        public ReceiptController(ILogger<ReceiptController> logger, BalanceDbContext dbContext)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<List<Receipt>> Get()
        {
            return await _dbContext.Receipts.ToListAsync();
        }

        [HttpPut]
        public async Task<IActionResult> Put(Receipt receipt)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { Errors = errors });
            }

            // TODO: Implement validation

            await _dbContext.Receipts.AddAsync(receipt);
            await _dbContext.SaveChangesAsync();

            return Created();
        }
    }
}