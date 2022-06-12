using System;
using System.Collections.Generic;
using System.Text;

namespace DataLayer.Models.Global
{
    public class GetAllByWhereGLB : CommonProperties
    {
        public string SortColumn { get; set; }
        public int LimitIndex { get; set; }
        public dynamic LimitRange { get; set; }
    }
}
