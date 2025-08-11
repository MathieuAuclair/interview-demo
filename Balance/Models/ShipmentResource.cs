using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Balance.Models
{
    public class ShipmentResource
    {
        [Key]
        public int Id { get; set; }

        [Column]
        [Display(Name = "количество")]
        [Range(0, int.MaxValue, ErrorMessage = "Количество недействительно!")]
        public int Quantity { get; set; }

        [Column]
        [ForeignKey("UnitId_ShipmentResource_Unit_fk")]
        public int? UnitId { get; set; }

        public virtual Unit Unit { get; set; }

        [Column]
        [ForeignKey("ResourceId_ShipmentResource_Resource_fk")]
        public int? ResourceId { get; set; }

        public virtual Resource Resource { get; set; }

        [Column]
        [ForeignKey("shipmentId_ShipmentResource_Shipment_fk")]
        public int? ShipmentId { get; set; }

        public virtual Shipment Shipment { get; set; }
    }
}