using DataLayer.Models.Global;
using Microsoft.EntityFrameworkCore;

namespace RepositoryLayer
{
    public class RawQueryRepo<T> : IRawQueryRepo<T> where T : class
    {
        #region "Variables"
        private readonly EntityContext _context;
        #endregion "Variables"

        #region "Constructors"
        public RawQueryRepo(EntityContext context)
        {
            this._context = context;
        }

        #endregion "Constructors"

        #region "Get Methods Implementation"
        public async Task<List<T>> GetAllByWhere(GetAllByWhereGLB getAllByWhereGLB)
        {
            string sql = default(string);
            if (string.IsNullOrEmpty(getAllByWhereGLB.WhereConditions))
            {
                if (getAllByWhereGLB.LimitRange == 0)
                {
                    sql = $@"SELECT * FROM ""{getAllByWhereGLB.TableOrViewName}"" ORDER BY {getAllByWhereGLB.SortColumn}";
                }
                else {
                    sql = $@"SELECT * FROM ""{getAllByWhereGLB.TableOrViewName}"" ORDER BY {getAllByWhereGLB.SortColumn} OFFSET {getAllByWhereGLB.LimitIndex} LIMIT {getAllByWhereGLB.LimitRange}";
                }
            }
            else
            {
                if (getAllByWhereGLB.LimitRange == 0)
                {
                    sql = $@"SELECT * FROM ""{getAllByWhereGLB.TableOrViewName}"" WHERE {getAllByWhereGLB.WhereConditions} ORDER BY {getAllByWhereGLB.SortColumn}";
                }
                else {
                    sql = $@"SELECT * FROM ""{getAllByWhereGLB.TableOrViewName}"" WHERE {getAllByWhereGLB.WhereConditions} ORDER BY {getAllByWhereGLB.SortColumn} OFFSET {getAllByWhereGLB.LimitIndex} LIMIT {getAllByWhereGLB.LimitRange}";
                }
            }

            var returnData = await _context.Set<T>().FromSqlRaw(sql).AsNoTracking().ToListAsync();
            return returnData;
        }

        public async Task<T> CountAllByWhere(CountAllByWhereGLB countAllByWhereGLB )
        {
            string sql = default(string);
            if (string.IsNullOrWhiteSpace(countAllByWhereGLB.WhereConditions))
            {
                sql = $@"SELECT Count(id) AS TotalRecord FROM ""{countAllByWhereGLB.TableOrViewName}""";
            }
            else
            {
                sql = $@"SELECT Count(id) AS TotalRecord FROM ""{countAllByWhereGLB.TableOrViewName}"" WHERE {countAllByWhereGLB.WhereConditions}";
            }
            return await _context.Set<T>().FromSqlRaw(sql).AsNoTracking().FirstOrDefaultAsync();
        }
        #endregion "Get Methods Implementation"
    }
}