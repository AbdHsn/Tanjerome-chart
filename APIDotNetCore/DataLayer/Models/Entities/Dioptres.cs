
using System.ComponentModel.DataAnnotations.Schema;

namespace DataLayer.Models.Entities
{
    public class Dioptres
    {
        public long Id { get; set; }
        public long? PatientId { get; set; }
        public decimal? Dioptre{ get; set; }
        public decimal? CalculatedAge { get; set; }
        public DateTime? InsertDate { get; set; }

        [NotMapped]
        public DateTime? DateOfBirth { get; set; }

    }
}
