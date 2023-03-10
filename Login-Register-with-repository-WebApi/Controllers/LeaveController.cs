using AutoMapper;
using Company_Project.Models;
using Company_Project.Models.DTO;
using Company_Project.Models.DTOs;
using Company_Project.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Globalization;

namespace Company_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class LeaveController : ControllerBase
    {
        private readonly ILeaveRepository _leaveRepository;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public LeaveController(ILeaveRepository leaveRepository,IMapper mapper, ApplicationDbContext context)
        {
            _leaveRepository = leaveRepository;
            _mapper= mapper;
            _context= context;
        }
        [HttpPost]
        [Route("AddLeave")]
        [Authorize(Roles = UserRoles.Role_Employee)]

        public async Task<IActionResult> AddLeave(LeaveDTO leaveDTO)
        {
            if((leaveDTO == null) && (!ModelState.IsValid))
            {
                return BadRequest(ModelState);
            }
            var user = _context.Leaves.FirstOrDefault(a=>a.EmployeeId==leaveDTO.EmployeeId);
            //if (user == null) return NotFound(new { message = "Unable to find Employee" });
            var leaveInDb = _leaveRepository.GetAll();
            foreach (var leaves in leaveInDb)
            {
                var findEmployeeLeave = _context.Leaves.Where(a => a.EmployeeId == leaveDTO.EmployeeId).ToList();
                if(findEmployeeLeave.Count==1) 
                {
                    return Ok(new { message = "Leave Already Applied" });
                }
            }
            var leave = _mapper.Map<LeaveDTO, Leave>(leaveDTO);
            _leaveRepository.Add(leave);
            var leav=_context.Leaves.FirstOrDefault(a=>a.EmployeeId==leaveDTO.EmployeeId);
            var leaveIdInDb = leav.LeaveId;
            return Ok( new { leaveIdInDb, status = 1,message="Leave Applied Sucessfully"});
        }

        [HttpGet]
        [Route("AllLeaves")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company + "," + UserRoles.Role_Employee)]

        public async Task<IActionResult> AllLeaves()
        {
            var leaveList=_leaveRepository.GetAll();
            if(leaveList==null) return NotFound(new {message="No Employee Applied for leave"});
            return Ok(leaveList);
        }

        [HttpPost]
        [Route("UpdateLeaveStatus/{employeeId}")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company )]

        public async Task<IActionResult> UpdateLeaveStatus(int employeeId, LeaveStatus leaveStatus)
        {
            var leave = _leaveRepository.Get(employeeId);
            if (leave == null) return NotFound(new { message = "Leave not found" });

            leave.LeaveStatus = leaveStatus;
            _leaveRepository.Update(leave);

            return Ok(new { status = 1, message = "Leave status updated successfully" });
        }

        [HttpGet]
        [Route("SpecificEmployeeLeaves")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company + "," + UserRoles.Role_Employee)]

        public async Task<IActionResult> SpecificEmployeeLeaves(int employeeId)
        {
            List<Leave> data = new List<Leave>();
            var leaveList = _leaveRepository.FirstOrDefault(emp=>emp.EmployeeId==employeeId);
            if (leaveList == null) return NotFound(new { message = "No Employee Applied for leave" });
            data.Add(leaveList);
            return Ok(data);
        }

        [Route("SpecificCompanyLeave")]
        [HttpPost]
        public IActionResult SpecificCompanyLeave(int companyId)
        {
            if (companyId == 0) return BadRequest();

            // Get the list of employees whose employee id is equal to companyId
            var companyEmployees = _context.Employees.Where(e => e.CompanyId == companyId).ToList();

            // Get the list of employees available in the leave table
            var employeesOnLeave = _context.Leaves.Select(l => l.Employee).ToList();

            // Return both lists as a JSON object
            return Ok(new { CompanyEmployees = companyEmployees, EmployeesOnLeave = employeesOnLeave });
        }


    }

}
}
