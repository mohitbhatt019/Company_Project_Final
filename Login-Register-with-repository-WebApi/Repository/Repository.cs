using Company_Project.Models;
using Company_Project.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Company_Project.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly ApplicationDbContext _context;
        internal DbSet<T> dbSet;
        public Repository(ApplicationDbContext context)
        {
            _context = context;
            dbSet = _context.Set<T>();
        }
        public void Add(T entity)
        {
            dbSet.Add(entity);
            _context.SaveChanges();
        }

        public T FirstOrDefault(Expression<Func<T, bool>> filter = null, string includeProperties = null)
        {
            IQueryable<T> query = dbSet;
            if (filter != null)
                query = query.Where(filter);

            if (includeProperties != null)
            {
                foreach (var includeProp in includeProperties.Split(new char[] { ',' }, StringSplitOptions.
                    RemoveEmptyEntries))
                {
                    query = query.Include(includeProp);
                }
            }
            return query.FirstOrDefault();
        }

        public T Get(int id)
        {
            return dbSet.Find(id);
        }

        public IEnumerable<T> GetAll(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>>
            orderBy = null, string includeProperties = null)  //Category,CoverType
        {
            IQueryable<T> query = dbSet;

            //Expression
            if (filter != null)
                query = query.Where(filter);

            //Multiple Tables
            if (includeProperties != null)
            {
                foreach (var includeProp in includeProperties.Split(new char[] { ',' },
                    StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp);
                }
            }

            //Sorting

            if (orderBy != null)
                return orderBy(query).ToList();

            return query.ToList();
        }

        public void Remove(T entity)
        {
            dbSet.Remove(entity);
            _context.SaveChanges();

        }

        public void Remove(int id)
        {
            //var entity = dbSet.Find(id);
            //dbSet.Remove(entity);

            var entity = Get(id);
            Remove(entity);
            _context.SaveChanges();

        }

        public void RemoveRange(IEnumerable<T> entity)
        {
            dbSet.RemoveRange(entity);
            _context.SaveChanges();

        }
    }
}
