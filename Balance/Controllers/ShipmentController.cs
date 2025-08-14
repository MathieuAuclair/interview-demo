using Balance.Helpers;
using Balance.Interfaces;
using Balance.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Balance.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class ShipmentController : ControllerBase
    {
        private readonly BalanceDbContext _dbContext;
        private readonly ILogger<ShipmentController> _logger;

        public ShipmentController(ILogger<ShipmentController> logger, BalanceDbContext dbContext)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<List<Shipment>> Get(bool isArchived)
        {
            return await _dbContext.Shipments
                .Where(s => s.IsArchived == isArchived)
                .Select(s => new Shipment
                {
                    Customer = new Customer { Id = s.Customer.Id, Name = s.Customer.Name },
                    CustomerId = s.CustomerId,
                    Date = s.Date,
                    Id = s.Id,
                    IsArchived = s.IsArchived,
                    IsSigned = s.IsSigned,
                    PurchaseOrder = s.PurchaseOrder,
                    ShipmentResources = s.ShipmentResources
                        .Select(sr => new ShipmentResource
                        {
                            Id = sr.Id,
                            Resource = new Resource { Id = sr.Resource.Id, Name = sr.Resource.Name },
                            ResourceId = sr.ResourceId,
                            Unit = new Unit { Id = sr.Unit.Id, Name = sr.Unit.Name },
                            UnitId = sr.UnitId,
                            Quantity = sr.Quantity,
                        }).ToList()
                })
                .AsNoTracking()
                .ToListAsync();
        }

        [HttpPatch]
        public async Task<IActionResult> Patch(Shipment shipment)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { Errors = errors });
            }

            if (shipment.Id == 0)
            {
                BadRequest("Неверный идентификатор");
            }

            var entity = await _dbContext.Shipments
                .FirstOrDefaultAsync(s => s.Id != shipment.Id && s.PurchaseOrder == shipment.PurchaseOrder);

            if (entity != null)
            {
                return BadRequest("Уже существует отгрузка с таким же именем.");
            }

            var previousEntity = await _dbContext.Shipments
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == shipment.Id);

            var previousShipmentResources = await _dbContext.ShipmentResources
                .Where(sr => sr.ShipmentId == shipment.Id)
                .AsNoTracking()
                .ToListAsync();

            var isInvalidBalance = await BalanceHelper.IsInvalidShipmentUpdate(
                _dbContext,
                previousShipmentResources,
                shipment.ShipmentResources.ToList(),
                previousEntity.IsSigned,
                shipment.IsSigned
            );

            if (isInvalidBalance)
            {
                return BadRequest("Недостаточный баланс");
            }

            var shipmentResourcesToDelete = previousShipmentResources
                .Where(sr => !shipment.ShipmentResources.Any(s => s.Id == sr.Id));

            _dbContext.ShipmentResources.RemoveRange(shipmentResourcesToDelete);
            _dbContext.Shipments.Update(shipment);


            BalanceHelper.UpdateBalanceFromShipment(
                _dbContext,
                previousShipmentResources,
                shipment.ShipmentResources,
                previousEntity?.IsSigned ?? false,
                shipment.IsSigned
            );

            await _dbContext.SaveChangesAsync();

            return Created();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _dbContext.Shipments
                .Include(e => e.ShipmentResources)
                .FirstOrDefaultAsync(entity => entity.Id == id);

            if (entity == null)
            {
                return NotFound("Не удалось найти предоставленный идентификатор.");
            }

            _dbContext.ShipmentResources.RemoveRange(entity.ShipmentResources);
            _dbContext.Shipments.Remove(entity);

            BalanceHelper.UpdateBalanceFromShipment(
                _dbContext,
                entity.ShipmentResources,
                new List<ShipmentResource>(), // удалить, будет пустым
                entity.IsSigned,
                false                         // удаление, не подписано
            );

            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}