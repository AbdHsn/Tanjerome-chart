using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace RepositoryLayer
{
    public interface IEntityRepo<T> where T: class
    {
        #region "Get Methods Definition"
        Task<IEnumerable<T>> GetAll();
        Task<T> GetById(Expression<Func<T, bool>> predicate);
        #endregion "Get Methods Definition"

        #region "DB Operation Methods Definition"
        Task<T> Insert(T entity);
        Task<List<T>> InsertRange(List<T> listEntity);
        Task<T> Update(T entity);
        Task<bool> Delete(T entity);
        #endregion "DB Operation Methods Definition"
    }
}
