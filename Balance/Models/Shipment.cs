using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Balance.Models
{
    public class Shipment
    {
        [Key]
        public int Id { get; set; }
        
        [Column]
        [MinLength(6)]
        [MaxLength(50)]
        [Display(Name = "номер заказа")]
        public string PurchaseOrder { get; set; }

        [Column]
        [Display(Name = "дата")]
        public DateTime Date { get; set; }

        [Column]
        public bool IsArchived { get; set; }

        [Column]
        [ForeignKey("customerId_Shipment_Customer_fk")]
        public int? CustomerId { get; set; }

        public virtual Customer Customer { get; set; }
    }
}