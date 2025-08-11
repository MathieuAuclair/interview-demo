using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Balance.Models
{
    public class Unit
    {
        [Key]
        public int Id { get; set; }

        [Column]
        [Display(Name = "единицы измерения")]
        public string Name { get; set; }

        [Column]
        public bool IsArchived { get; set; }
    }
}