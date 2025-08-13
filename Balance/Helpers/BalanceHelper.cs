using Balance.Interfaces;
using Balance.Models;

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
    }
}