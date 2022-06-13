using DataLayer.Models.Entities;
using FluentValidation;

namespace APIDotNetCore.Models.Validation
{
    public class PatientRecordsValidation : AbstractValidator<PatientRecords>
    {
        public PatientRecordsValidation()
        {
            RuleFor(r => r.Name).NotNull().NotEmpty();
            RuleFor(r => r.Phone).NotNull().NotEmpty();
            RuleFor(r => r.Dioptres).GreaterThanOrEqualTo(0).LessThanOrEqualTo(500);
        }
    }
}
