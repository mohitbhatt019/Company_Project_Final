using Company_Project.Models;
using Company_Project.Repository.IRepository;

namespace Company_Project.Repository
{
    public class LeaveRepository : Repository<Leave>, ILeaveRepository
    {
        private readonly ApplicationDbContext _context;
        public LeaveRepository(ApplicationDbContext context):base(context)
        {
            _context = context;
        }

        public void Update(Leave leave)
        {
            _context.Update(leave);
            _context.SaveChanges();
        }
    }
}
