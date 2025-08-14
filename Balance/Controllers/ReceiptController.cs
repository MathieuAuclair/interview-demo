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
        public async Task<List<Receipt>> Get(
            [FromQuery] List<int?> resourceFilters,
            [FromQuery] List<int?> unitFilters,
            [FromQuery] string search,
            [FromQuery] DateTime? after,
            [FromQuery] DateTime? before)
        {
            var receipts = await _dbContext.Receipts
                .Where(s => after == null || s.Date >= after)
                .Where(s => before == null || s.Date <= before)
                .Where(s => search == null || search.Length <= 0 || s.PurchaseOrder.Contains(search))
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

            return receipts
                .Where(r => resourceFilters.Count() <= 0 || resourceFilters.Any(f => r.ReceiptResources.Any(rr => rr.ResourceId == f)))
                .Where(r => unitFilters.Count() <= 0 || unitFilters.Any(f => r.ReceiptResources.Any(rr => rr.ResourceId == f)))
                .ToList();
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

            var isInvalidBalance = await BalanceHelper.IsInvalidReceiptUpdate(
                _dbContext,
                previousResources,
                receipt.ReceiptResources.ToList()
            );

            if (isInvalidBalance)
            {
                return BadRequest("Недостаточный баланс");
            }

            var recieptResourcesToDelete = previousResources
                .Where(sr => !receipt.ReceiptResources.Any(s => s.Id == sr.Id));

            _dbContext.ReceiptResources.RemoveRange(recieptResourcesToDelete);
            _dbContext.Receipts.Update(receipt);

            BalanceHelper.UpdateBalanceFromReceipt(_dbContext, previousResources, receipt.ReceiptResources);

            await _dbContext.SaveChangesAsync();

            return Created();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _dbContext.Receipts
                .Include(e => e.ReceiptResources)
                .FirstOrDefaultAsync(entity => entity.Id == id);

            if (entity == null)
            {
                return NotFound("Не удалось найти предоставленный идентификатор.");
            }

            if (await BalanceHelper.IsInvalidReceiptDeletion(_dbContext, id))
            {
                return BadRequest("Недостаточный баланс");
            }

            _dbContext.Receipts.Remove(entity);

            BalanceHelper.UpdateBalanceFromReceipt(
                _dbContext,
                entity.ReceiptResources,
                new List<ReceiptResource>() // удалить, будет пустым
            );

            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}