using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Balance.Models
{
    public class Receipt
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

        public virtual IEnumerable<ReceiptResource> ReceiptResources { get; set; }
    }
}