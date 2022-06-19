using DataLayer.Models.Entities;
using FluentValidation;

namespace APIDotNetCore.Models.Validation
{
    public class DioptresValidation : AbstractValidator<Dioptres>
    {
        public DioptresValidation()
        {
            RuleFor(r => r.Dioptre).NotNull().NotEmpty().GreaterThanOrEqualTo(0).LessThanOrEqualTo(100);
        }
    }
}
