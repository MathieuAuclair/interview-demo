using Balance.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Balance.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class ResourceController : ControllerBase
    {
        private readonly BalanceDbContext _dbContext;
        private readonly ILogger<ReceiptController> _logger;

        public ResourceController(ILogger<ReceiptController> logger, BalanceDbContext dbContext)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<List<Resource>> Get(bool isArchived)
        {
            return await _dbContext.Resources
                .Where(resource => resource.isArchived == isArchived)
                .ToListAsync();
        }

        [HttpPut]
        public async Task<IActionResult> Put(Resource resource)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { Errors = errors });
            }

            var entity = await _dbContext.Resources
                .FirstOrDefaultAsync(r => r.Name == resource.Name);

            if (entity != null)
            {
                return BadRequest("Уже существует единица с таким же именем.");
            }

            await _dbContext.Resources.AddAsync(resource);
            await _dbContext.SaveChangesAsync();

            return Created();
        }

        [HttpPatch]
        public async Task<IActionResult> Patch(Resource resource)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { Errors = errors });
            }

            if (resource.Id == 0)
            {
                BadRequest("Неверный идентификатор");
            }

            var entity = await _dbContext.Resources
                .FirstOrDefaultAsync(r => r.Id != resource.Id && r.Name == resource.Name);

            if (entity != null)
            {
                return BadRequest("Уже существует единица с таким же именем.");
            }

            _dbContext.Resources.Update(resource);
            await _dbContext.SaveChangesAsync();

            return Created();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _dbContext.Resources
                .FirstOrDefaultAsync(entity => entity.Id == id);

            if (entity == null)
            {
                return NotFound("Не удалось найти предоставленный идентификатор.");
            }

            try
            {
                _dbContext.Resources.Remove(entity);
                await _dbContext.SaveChangesAsync();

                return Ok("удалено");
            }
            catch
            {
                entity.isArchived = true;

                _dbContext.Resources.Update(entity);
                await _dbContext.SaveChangesAsync();

                return Ok("архивированный");
            }
        }
    }
}