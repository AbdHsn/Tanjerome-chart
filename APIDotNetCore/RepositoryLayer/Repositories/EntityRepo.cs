using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace RepositoryLayer
{
    public class EntityRepo<T> : IEntityRepo<T> where T : class
    {
        #region "Variables"
        private readonly EntityContext _context;
        private DbSet<T> entities;
        #endregion "Variables"

        #region "Constructors"
        public EntityRepo(EntityContext context)
        {
            this._context = context;
            entities = _context.Set<T>();
        }

        #endregion "Constructors"

        #region "Get Methods Implementation"
        public async Task<IEnumerable<T>> GetAll()
        {
            return await entities.ToListAsync();
        }
       
        public async Task<IEnumerable<T>> GetAllByFilter(Expression<Func<T, bool>> predicate)
        {
            return await entities.Where(predicate).ToListAsync();
        }
        
        public async Task<T> GetById(Expression<Func<T, bool>> predicate)
        {
            var t =  await entities.FirstOrDefaultAsync(predicate);
            return t;
        }
        
        public async Task<T> GetLatestOne(Expression<Func<T, bool>> predicate)
        {
            var t =  await entities.LastOrDefaultAsync(predicate);
            return t;
        }
        #endregion "Get Methods Implementation"

        #region "DB Operation Methods Implementation"

        public async Task<T> Insert(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("Insertion can't proceed on null object.");
            }
            entities.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<T>> InsertRange(List<T> listEntity)
        {
            if (listEntity.Count <= 0)
            {
                throw new ArgumentNullException("Insertion can't proceed on null or zero object.");
            }
            entities.AddRangeAsync(listEntity);
            await _context.SaveChangesAsync();
            return listEntity;
        }

        public async Task<T> Update(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("Update can't proceed on null object.");
            }

            entities.Update(entity);
            await  _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> Delete(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("Delete can't proceed on null object.");
            }
            entities.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
        #endregion "DB Operation Methods Implementation"
    }
}