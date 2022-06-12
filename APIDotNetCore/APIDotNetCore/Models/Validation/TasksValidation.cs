using DataLayer.Models.Entities;
using FluentValidation;

namespace APIDotNetCore.Models.Validation
{
    public class TasksValidation : AbstractValidator<Tasks>
    {
        public TasksValidation()
        {
            RuleFor(r => r.title).NotNull().NotEmpty();
            RuleFor(r => r.details).NotNull().NotEmpty();
            RuleFor(r => r.progress_ratio).GreaterThanOrEqualTo(0).LessThanOrEqualTo(100);
            RuleFor(r => r.status).NotNull().NotEmpty();
        }
    }
}
