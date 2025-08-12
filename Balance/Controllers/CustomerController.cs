using Balance.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Balance.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly BalanceDbContext _dbContext;
        private readonly ILogger<CustomerController> _logger;

        public CustomerController(ILogger<CustomerController> logger, BalanceDbContext dbContext)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<List<Customer>> Get(bool isArchived)
        {
            return await _dbContext.Customers
                .Where(customer => customer.IsArchived == isArchived)
                .ToListAsync();
        }

        [HttpPut]
        public async Task<IActionResult> Put(Customer customer)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { Errors = errors });
            }

            var entity = await _dbContext.Customers
                .FirstOrDefaultAsync(r => r.Name == customer.Name);

            if (entity != null)
            {
                return BadRequest("Уже существует единица с таким же именем.");
            }

            await _dbContext.Customers.AddAsync(customer);
            await _dbContext.SaveChangesAsync();

            return Created();
        }

        [HttpPatch]
        public async Task<IActionResult> Patch(Customer customer)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { Errors = errors });
            }

            if (customer.Id == 0)
            {
                BadRequest("Неверный идентификатор");
            }

            var entity = await _dbContext.Customers
                .FirstOrDefaultAsync(r => r.Id != customer.Id && r.Name == customer.Name);

            if (entity != null)
            {
                return BadRequest("Уже существует единица с таким же именем.");
            }

            _dbContext.Customers.Update(customer);
            await _dbContext.SaveChangesAsync();

            return Created();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _dbContext.Customers
                .FirstOrDefaultAsync(entity => entity.Id == id);

            if (entity == null)
            {
                return NotFound("Не удалось найти предоставленный идентификатор.");
            }

            try
            {
                _dbContext.Customers.Remove(entity);
                await _dbContext.SaveChangesAsync();

                return Ok("удалено");
            }
            catch
            {
                entity.IsArchived = true;

                _dbContext.Customers.Update(entity);
                await _dbContext.SaveChangesAsync();

                return Ok("архивированный");
            }
        }
    }
}