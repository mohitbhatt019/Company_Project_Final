using Company_Project.Models;
using Company_Project.Repository.IRepository;

namespace Company_Project.Repository
{
    public class EmployeeRepository : Repository<Employee>, IEmployeeRepository
    {
        private readonly ApplicationDbContext _context;
        public EmployeeRepository(ApplicationDbContext context):base(context)
        {
            _context = context;
        }

        public void Update(Employee employee)
        {
            _context.Update(employee);
            _context.SaveChanges();
        }
    }
}
