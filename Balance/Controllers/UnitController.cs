using Balance.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Balance.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class UnitController : ControllerBase
    {
        private readonly BalanceDbContext _dbContext;
        private readonly ILogger<UnitController> _logger;

        public UnitController(ILogger<UnitController> logger, BalanceDbContext dbContext)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<List<Unit>> Get(bool isArchived)
        {
            return await _dbContext.Units
                .Where(unit => unit.IsArchived == isArchived)
                .ToListAsync();
        }

        [HttpPut]
        public async Task<IActionResult> Put(Unit unit)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { Errors = errors });
            }

            var entity = await _dbContext.Units
                .FirstOrDefaultAsync(r => r.Name == unit.Name);

            if (entity != null)
            {
                return BadRequest("Уже существует единица с таким же именем.");
            }

            await _dbContext.Units.AddAsync(unit);
            await _dbContext.SaveChangesAsync();

            return Created();
        }

        [HttpPatch]
        public async Task<IActionResult> Patch(Unit unit)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { Errors = errors });
            }

            if (unit.Id == 0)
            {
                BadRequest("Неверный идентификатор");
            }

            var entity = await _dbContext.Units
                .FirstOrDefaultAsync(r => r.Id != unit.Id && r.Name == unit.Name);

            if (entity != null)
            {
                return BadRequest("Уже существует единица с таким же именем.");
            }

            _dbContext.Units.Update(unit);
            await _dbContext.SaveChangesAsync();

            return Created();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _dbContext.Units
                .FirstOrDefaultAsync(entity => entity.Id == id);

            if (entity == null)
            {
                return NotFound("Не удалось найти предоставленный идентификатор.");
            }

            try
            {
                _dbContext.Units.Remove(entity);
                await _dbContext.SaveChangesAsync();

                return Ok("удалено");
            }
            catch
            {
                entity.IsArchived = true;

                _dbContext.Units.Update(entity);
                await _dbContext.SaveChangesAsync();

                return Ok("архивированный");
            }
        }
    }
}