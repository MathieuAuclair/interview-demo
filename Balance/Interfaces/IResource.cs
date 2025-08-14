using Balance.Models;

namespace Balance.Interfaces
{
    public interface IResource
    {
        int Id { get; set; }
        int Quantity { get; set; }
        int? ResourceId { get; set; }
        Resource Resource { get; set; }
        int? UnitId { get; set; }
        Unit Unit { get; set; }
    }
}