using Balance.Helpers;
using Balance.Interfaces;
using Balance.Models;
using Balance.Tests.Factories;
using Microsoft.EntityFrameworkCore;

namespace Balance.Tests
{
    [TestClass]
    [DoNotParallelize]
    public sealed class BalanceHelperTest
    {
        [TestInitialize]
        public async Task Initialize()
        {
            var context = DbContextFactory.Create();

            await context.Database.MigrateAsync();
            await context.Balances.ExecuteDeleteAsync();
            await context.ReceiptResources.ExecuteDeleteAsync();
            await context.ShipmentResources.ExecuteDeleteAsync();
            await context.Resources.ExecuteDeleteAsync();
            await context.Units.ExecuteDeleteAsync();
            await context.Shipments.ExecuteDeleteAsync();
        }

        [TestMethod]
        public async Task RegisterReceptionReceipt()
        {
            const int EXPECTED_BALANCE_COUNT = 3;

            var setup = new TestSetupFactory();
            var units = await setup.CreateUnitsAsync(EXPECTED_BALANCE_COUNT);
            var resources = await setup.CreateResourcesAsync(EXPECTED_BALANCE_COUNT);
            var receiptResources = setup.CreateReceiptResources(resources, units, EXPECTED_BALANCE_COUNT)
                                        .Cast<IResource>()
                                        .ToList();

            BalanceHelper.UpdateBalanceFromReceipt(
                setup.Context,
                new List<ReceiptResource>(),
                receiptResources
            );

            await setup.Context.SaveChangesAsync();

            var balances = await setup.Context.Balances.ToListAsync();

            Assert.AreEqual(EXPECTED_BALANCE_COUNT, balances.Count);

            foreach (var balance in balances)
            {
                var resource = receiptResources
                    .FirstOrDefault(r => r.ResourceId == balance.ResourceId && r.UnitId == balance.UnitId);

                Assert.IsNotNull(resource);
                Assert.AreEqual(resource.Quantity, balance.Quantity);
            }
        }


        [TestMethod]
        public async Task ChangeReceptionReceipt()
        {
            const int EXPECTED_BALANCE_COUNT = 3;

            var setup = new TestSetupFactory();
            var units = await setup.CreateUnitsAsync(EXPECTED_BALANCE_COUNT);
            var resources = await setup.CreateResourcesAsync(EXPECTED_BALANCE_COUNT);
            var receiptResources = setup.CreateReceiptResources(resources, units, EXPECTED_BALANCE_COUNT)
                                        .Cast<IResource>()
                                        .ToList();

            BalanceHelper.UpdateBalanceFromReceipt(
                setup.Context,
                new List<ReceiptResource>(),
                receiptResources
            );
            await setup.Context.SaveChangesAsync();

            var balances = await setup.Context.Balances.ToListAsync();

            Assert.AreEqual(EXPECTED_BALANCE_COUNT, balances.Count);

            foreach (var balance in balances)
            {
                var resource = receiptResources
                    .FirstOrDefault(r => r.ResourceId == balance.ResourceId && r.UnitId == balance.UnitId);

                Assert.IsNotNull(resource);
                Assert.AreEqual(resource.Quantity, balance.Quantity);
            }

            var random = new Random();

            var updateReceiptResouces = receiptResources.Select(rr =>
            {
                return new ReceiptResource
                {
                    Quantity = random.Next(0, 1000),
                    Resource = rr.Resource,
                    ResourceId = rr.ResourceId,
                    Unit = rr.Unit,
                    UnitId = rr.UnitId
                };
            }).ToList();

            BalanceHelper.UpdateBalanceFromReceipt(
                setup.Context,
                receiptResources,
                updateReceiptResouces
            );

            await setup.Context.SaveChangesAsync();

            balances = await setup.Context.Balances.ToListAsync();

            foreach (var balance in balances)
            {
                var resource = updateReceiptResouces
                    .FirstOrDefault(r => r.ResourceId == balance.ResourceId && r.UnitId == balance.UnitId);

                Assert.IsNotNull(resource);
                Assert.AreEqual(resource.Quantity, balance.Quantity);
            }
        }

        [TestMethod]
        public async Task SignShipment()
        {
            const int EXPECTED_BALANCE_COUNT = 3;

            var setup = new TestSetupFactory();
            var units = await setup.CreateUnitsAsync(EXPECTED_BALANCE_COUNT);
            var resources = await setup.CreateResourcesAsync(EXPECTED_BALANCE_COUNT);
            var shipmentResources = setup.CreateShipmentResources(resources, units, EXPECTED_BALANCE_COUNT)
                                        .Cast<IResource>()
                                        .ToList();

            await setup.Context.SaveChangesAsync();

            BalanceHelper.UpdateBalanceFromShipment(
                setup.Context,
                new List<ShipmentResource>(),
                shipmentResources,
                false,
                true
            );

            await setup.Context.SaveChangesAsync();

            var balances = await setup.Context.Balances.ToListAsync();

            Assert.AreEqual(EXPECTED_BALANCE_COUNT, balances.Count);

            foreach (var balance in balances)
            {
                var resource = shipmentResources
                    .FirstOrDefault(r => r.ResourceId == balance.ResourceId && r.UnitId == balance.UnitId);

                Assert.IsNotNull(resource);
                Assert.AreEqual(-resource.Quantity, balance.Quantity);
            }
        }


        [TestMethod]
        public async Task UnsignShipment()
        {
            const int EXPECTED_BALANCE_COUNT = 3;

            var setup = new TestSetupFactory();
            var units = await setup.CreateUnitsAsync(EXPECTED_BALANCE_COUNT);
            var resources = await setup.CreateResourcesAsync(EXPECTED_BALANCE_COUNT);
            var shipmentResources = setup.CreateShipmentResources(resources, units, EXPECTED_BALANCE_COUNT)
                                        .Cast<IResource>()
                                        .ToList();

            BalanceHelper.UpdateBalanceFromShipment(
                setup.Context,
                new List<ShipmentResource>(),
                shipmentResources,
                false,
                true
            );

            await setup.Context.SaveChangesAsync();

            BalanceHelper.UpdateBalanceFromShipment(
                setup.Context,
                shipmentResources,
                new List<ShipmentResource>(), // не имеет значения, неподписанные количества не влияют на баланс
                true,
                false
            );

            await setup.Context.SaveChangesAsync();

            var balances = await setup.Context.Balances.ToListAsync();

            Assert.AreEqual(EXPECTED_BALANCE_COUNT, balances.Count);

            foreach (var balance in balances)
            {
                var resource = shipmentResources
                    .FirstOrDefault(r => r.ResourceId == balance.ResourceId && r.UnitId == balance.UnitId);

                Assert.IsNotNull(resource);
                Assert.AreEqual(0, balance.Quantity);
            }
        }

        [TestMethod]
        public async Task ChangeSignedShipmentQuantity()
        {
            const int EXPECTED_BALANCE_COUNT = 3;

            var setup = new TestSetupFactory();
            var units = await setup.CreateUnitsAsync(EXPECTED_BALANCE_COUNT);
            var resources = await setup.CreateResourcesAsync(EXPECTED_BALANCE_COUNT);
            var shipmentResources = setup.CreateShipmentResources(resources, units, EXPECTED_BALANCE_COUNT)
                                        .Cast<IResource>()
                                        .ToList();

            BalanceHelper.UpdateBalanceFromShipment(
                setup.Context,
                new List<ShipmentResource>(),
                shipmentResources,
                false,
                true
            );

            await setup.Context.SaveChangesAsync();

            var balances = await setup.Context.Balances.ToListAsync();

            Assert.AreEqual(EXPECTED_BALANCE_COUNT, balances.Count);

            foreach (var balance in balances)
            {
                var resource = shipmentResources
                    .FirstOrDefault(r => r.ResourceId == balance.ResourceId && r.UnitId == balance.UnitId);

                Assert.IsNotNull(resource);
                Assert.AreEqual(-resource.Quantity, balance.Quantity);
            }

            var random = new Random();

            var updateShipmentResouces = shipmentResources.Select(rr =>
            {
                return new ReceiptResource
                {
                    Quantity = random.Next(0, 1000),
                    Resource = rr.Resource,
                    ResourceId = rr.ResourceId,
                    Unit = rr.Unit,
                    UnitId = rr.UnitId
                };
            }).ToList();

            BalanceHelper.UpdateBalanceFromShipment(
                setup.Context,
                shipmentResources,
                updateShipmentResouces,
                true,
                true
            );

            await setup.Context.SaveChangesAsync();

            balances = await setup.Context.Balances.ToListAsync();

            foreach (var balance in balances)
            {
                var resource = updateShipmentResouces
                    .FirstOrDefault(r => r.ResourceId == balance.ResourceId && r.UnitId == balance.UnitId);

                Assert.IsNotNull(resource);
                Assert.AreEqual(-resource.Quantity, balance.Quantity);
            }
        }
    }
}