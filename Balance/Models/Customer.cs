using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Balance.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Column]
        [MinLength(6)]
        [MaxLength(50)]
        [Display(Name = "наименование")]
        public string Name { get; set; }

        [Column]
        [MinLength(6)]
        [MaxLength(150)]
        [Display(Name = "адрес")]
        public string Address { get; set; }

        [Column]
        public bool IsArchived { get; set; }

        public virtual IEnumerable<Shipment> Shipments { get; set; }
    }
}