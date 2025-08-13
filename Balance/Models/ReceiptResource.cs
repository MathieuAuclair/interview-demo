using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Balance.Interfaces;

namespace Balance.Models
{
    public class ReceiptResource : IResource
    {
        [Key]
        public int Id { get; set; }

        [Column]
        [Display(Name = "количество")]
        [Range(0, int.MaxValue, ErrorMessage = "Количество недействительно!")]
        public int Quantity { get; set; }

        [Column]
        [ForeignKey("UnitId_ResourceReciept_Unit_fk")]
        public int? UnitId { get; set; }

        public virtual Unit Unit { get; set; }

        [Column]
        [ForeignKey("ResourceId_ResourceReciept_Resource_fk")]
        public int? ResourceId { get; set; }

        public virtual Resource Resource { get; set; }


        [Column]
        [ForeignKey("ReceiptId_ResourceReciept_Receipt_fk")]
        public int? ReceiptId { get; set; }

        public virtual Receipt Receipt { get; set; }
    }
}