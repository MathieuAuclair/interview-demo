using Balance.Models;
using Balance.Tests.Factories;
using Bogus;

public sealed class TestSetupFactory
{
    public BalanceDbContext Context { get; }

    public TestSetupFactory()
    {
        Context = DbContextFactory.Create();
    }

    public async Task<List<Unit>> CreateUnitsAsync(int count = 3)
    {
        var unitFactory = new Faker<Unit>()
            .RuleFor(u => u.IsArchived, false)
            .RuleFor(u => u.Name, f => f.Name.Random.Word());

        var units = unitFactory.Generate(count);
        await Context.Units.AddRangeAsync(units);
        await Context.SaveChangesAsync();
        return units;
    }

    public async Task<List<Resource>> CreateResourcesAsync(int count = 3)
    {
        var resourceFactory = new Faker<Resource>()
            .RuleFor(r => r.IsArchived, false)
            .RuleFor(r => r.Name, f => f.Name.Random.Word());

        var resources = resourceFactory.Generate(count);
        await Context.Resources.AddRangeAsync(resources);
        await Context.SaveChangesAsync();
        return resources;
    }

    public List<ReceiptResource> CreateReceiptResources(List<Resource> resources, List<Unit> units, int count)
    {
        var index = 0;
        var factory = new Faker<ReceiptResource>()
            .RuleFor(r => r.Quantity, f => f.Random.Int(1, 100))
            .FinishWith((f, r) =>
            {
                r.ResourceId = r.Resource.Id;
                r.UnitId = r.Unit.Id;
            });

        var receiptResources = new List<ReceiptResource>();
        while (index < count)
        {
            factory.RuleFor(r => r.Resource, resources[index])
                   .RuleFor(r => r.Unit, units[index]);
            receiptResources.Add(factory.Generate());
            index++;
        }

        return receiptResources;
    }

    public List<ShipmentResource> CreateShipmentResources(List<Resource> resources, List<Unit> units, int count)
    {
        var index = 0;
        var factory = new Faker<ShipmentResource>()
            .RuleFor(r => r.Quantity, f => f.Random.Int(1, 100))
            .FinishWith((f, r) =>
            {
                r.ResourceId = r.Resource.Id;
                r.UnitId = r.Unit.Id;
            });

        var shipmentResources = new List<ShipmentResource>();
        while (index < count)
        {
            factory.RuleFor(r => r.Resource, resources[index])
                   .RuleFor(r => r.Unit, units[index]);
            shipmentResources.Add(factory.Generate());
            index++;
        }

        return shipmentResources;
    }
}
