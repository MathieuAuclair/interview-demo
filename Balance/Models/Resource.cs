using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Balance.Models
{
    public class Resource
    {
        [Key]
        public int Id { get; set; }

        [Column]
        [MinLength(6)]
        [MaxLength(50)]
        [Display(Name = "наименование")]
        public string Name { get; set; }

        [Column]
        public bool isArchived { get; set; }
    }
}