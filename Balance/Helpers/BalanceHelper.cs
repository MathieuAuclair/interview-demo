using Balance.Interfaces;
using Balance.Models;
using Microsoft.EntityFrameworkCore;

namespace Balance.Helpers
{
    public class BalanceHelper
    {
        public static void UpdateBalanceFromReceipt(
            BalanceDbContext context,
            IEnumerable<IResource> previousResources,
            IEnumerable<IResource> newResources)
        {
            UpdateBalance(context, newResources);
            UpdateBalance(context, previousResources, true);
        }

        public static void UpdateBalanceFromShipment(
            BalanceDbContext context,
            IEnumerable<IResource> previousResources,
            IEnumerable<IResource> newResources,
            bool previousIsSigned,
            bool newIsSigned)
        {
            if (newIsSigned && !previousIsSigned)
            {
                UpdateBalance(context, newResources, true);
            }
            else if (!newIsSigned && previousIsSigned)
            {
                UpdateBalance(context, previousResources);
            }
            else if (newIsSigned)
            {
                UpdateBalance(context, previousResources);
                UpdateBalance(context, newResources, true);
            }
        }

        private static void UpdateBalance(BalanceDbContext context, IEnumerable<IResource> resources, bool isSubstraction = false)
        {
            var balancesToUpdate = new List<Models.Balance>();

            foreach (var resource in resources)
            {
                var balance = context.Balances
                    .FirstOrDefault(b => b.ResourceId == resource.ResourceId && b.UnitId == resource.UnitId);

                if (balance != null)
                {
                    if (isSubstraction)
                    {
                        balance.Quantity -= resource.Quantity;
                    }
                    else
                    {
                        balance.Quantity += resource.Quantity;
                    }

                    balancesToUpdate.Add(balance);
                }
            }

            var missingBalances = resources
                .Where(r => balancesToUpdate.All(b => b.ResourceId != r.ResourceId || b.UnitId != r.UnitId))
                .Select(r => new Models.Balance
                {
                    Quantity = isSubstraction ? r.Quantity * -1 : r.Quantity,
                    ResourceId = r.ResourceId,
                    UnitId = r.UnitId
                });

            balancesToUpdate.AddRange(missingBalances);

            context.Balances.UpdateRange(balancesToUpdate);
        }

        public static async Task<bool> IsInvalidReceiptDeletion(BalanceDbContext context, int id)
        {
            return await context.Balances
                .Select(b =>
                 context.ReceiptResources
                        .Where(r => r.ReceiptId == id)
                        .Where(r => r.ResourceId == b.ResourceId && r.UnitId == b.UnitId)
                        .FirstOrDefault(r => r.Quantity > b.Quantity)
                )
                .Where(r => r != null)
                .AnyAsync();
        }

        public static async Task<bool> IsInvalidReceiptUpdate(
            BalanceDbContext context,
            List<ReceiptResource> previousResources,
            List<ReceiptResource> newRessources)
        {
            foreach (var previousResource in previousResources)
            {
                var newResource = newRessources.FirstOrDefault(r => r.Id == previousResource.Id);
                var stockDelta = (newResource?.Quantity ?? 0) - previousResource.Quantity;

                if (stockDelta >= 0)
                {
                    continue;  // переход к избытку
                }

                var hasInvalidBalance = await context.Balances
                    .Where(r => r.ResourceId == previousResource.ResourceId && r.UnitId == previousResource.UnitId)
                    .Where(r => r.Quantity < -stockDelta)
                    .AnyAsync();

                if (hasInvalidBalance)
                {
                    return true;
                }
            }

            return false;
        }

        public static async Task<bool> IsInvalidShipmentUpdate(
            BalanceDbContext context,
            List<ShipmentResource> previousResources,
            List<ShipmentResource> newRessources,
            bool isPreviousSigned,
            bool isNewSigned)
        {
            foreach (var previousResource in previousResources)
            {
                var newResource = newRessources.FirstOrDefault(r => r.Id == previousResource.Id);
                var previousQuantity = isPreviousSigned ? (previousResource?.Quantity ?? 0) : 0;
                var newQuantity = isNewSigned ? (newResource?.Quantity ?? 0) : 0;

                var stockDelta =  previousQuantity - newQuantity;

                if (stockDelta >= 0)
                {
                    continue;  // переход к избытку
                }

                var hasInvalidBalance = await context.Balances
                    .Where(r => r.ResourceId == previousResource.ResourceId && r.UnitId == previousResource.UnitId)
                    .Where(r => r.Quantity < -stockDelta)
                    .AnyAsync();

                if (hasInvalidBalance)
                {
                    return true;
                }
            }

            return false;
        }
    }
}