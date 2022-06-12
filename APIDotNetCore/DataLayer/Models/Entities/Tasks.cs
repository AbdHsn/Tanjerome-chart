using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Models.Entities
{
    public class Tasks
    {
        public long id { get; set; }
        public string? title { get; set; }
        public string? details { get; set; }
        public double? progress_ratio { get; set; }
        public string? status { get; set; }
        public DateTime? insert_date { get; set; }
    }
}
