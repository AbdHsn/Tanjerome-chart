using DataLayer.Models.Global;

namespace RepositoryLayer
{
    public interface IRawQueryRepo<T> where T : class
    {
        #region "Get Methods Definition"
        Task<List<T>> GetAllByWhere(GetAllByWhereGLB getAllByWhereGLB);

        Task<T> CountAllByWhere(CountAllByWhereGLB countAllByWhereGLB);

        #endregion "Get Methods Definition"
    }
}
