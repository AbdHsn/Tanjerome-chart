
using System.ComponentModel.DataAnnotations.Schema;

namespace DataLayer.Models.Entities
{
    public class PatientRecords
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? PatientId { get; set; }
        public string? Phone { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? InsertDate { get; set; }
        [NotMapped]
        public int? Age { get; set; }
        [NotMapped]
        public decimal? Dioptres { get; set; }
        [NotMapped]
        public object? ChartData { get; set; }
    }
}
