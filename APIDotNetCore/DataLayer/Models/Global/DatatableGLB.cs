using System.Collections.Generic;

namespace DataLayer.Models.Global
{
     public class DatatableGLB
    {
        public List<Column>? columns { get; set; }
        public List<Order>? orders { get; set; }
        public int start { get; set; }
        public string length { get; set; }

        public Search? search { get; set; }
        public List<Search>? searches { get; set; }

    }

    public class Search
    {
        public string? value { get; set; }
        public string? search_by { get; set; }
      
        public string? fromdate { get; set; }
        public string? todate { get; set; }

        public bool? regex { get; set; }
    }

    public class Column
    {
        public string? data { get; set; }
        public string? name { get; set; }
        public bool? searchable { get; set; }
        public bool? orderable { get; set; }
        public Search? search { get; set; }
    }

    public class Order
    {
        public string? column { get; set; } // 'Id'
        public string? order_by { get; set; } //'asc' or 'desc'
    }
}
