
namespace DataLayer.Models.Entities
{
    public class PatientRecords
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public decimal? Dioptres { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? InsertDate { get; set; }
    }
}
