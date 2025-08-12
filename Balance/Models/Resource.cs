using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Balance.Models
{
    public class Resource
    {
        [Key]
        public int Id { get; set; }

        [Column]
        [MinLength(3)]
        [MaxLength(50)]
        [Display(Name = "наименование")]
        public string Name { get; set; }

        [Column]
        public bool IsArchived { get; set; }

        public virtual IEnumerable<ResourceReciept> ResourceReciepts { get; set; }
        public virtual IEnumerable<ShipmentResource> ShipmentResources { get; set; }
        public virtual IEnumerable<Balance> Balances { get; set; }
    }
}