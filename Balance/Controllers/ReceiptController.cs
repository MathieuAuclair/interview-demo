using Balance.Helpers;
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
            return await _dbContext.Receipts
                .Select(r => new Receipt
                {
                    Id = r.Id,
                    Date = r.Date,
                    PurchaseOrder = r.PurchaseOrder,
                    ReceiptResources = r.ReceiptResources.Select(rr => new ReceiptResource
                    {
                        Id = rr.Id,
                        Quantity = rr.Quantity,
                        Resource = rr.Resource,
                        ResourceId = rr.ResourceId,
                        Unit = rr.Unit,
                        UnitId = rr.UnitId
                    })
                })
                .ToListAsync();
        }

        [HttpPatch]
        public async Task<IActionResult> Patch(Receipt receipt)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { Errors = errors });
            }

            if (receipt.Id == 0)
            {
                BadRequest("Неверный идентификатор");
            }

            var entity = await _dbContext.Receipts
                .FirstOrDefaultAsync(s => s.Id != receipt.Id && s.PurchaseOrder == receipt.PurchaseOrder);

            if (entity != null)
            {
                return BadRequest("Уже существует отгрузка с таким же именем.");
            }

            var previousResources = await _dbContext.ReceiptResources
                .Where(sr => sr.ReceiptId == receipt.Id)
                .AsNoTracking()
                .ToListAsync();

            var recieptResourcesToDelete = previousResources
                .Where(sr => !receipt.ReceiptResources.Any(s => s.Id == sr.Id));

            _dbContext.ReceiptResources.RemoveRange(recieptResourcesToDelete);
            _dbContext.Receipts.Update(receipt);

            BalanceHelper.UpdateBalanceFromReceipt(_dbContext, previousResources, receipt.ReceiptResources);

            await _dbContext.SaveChangesAsync();

            return Created();
        }
    }
}