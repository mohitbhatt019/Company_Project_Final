using AutoMapper;
using Company_Project.Models;
using Company_Project.Models.DTO;
using Company_Project.Models.DTOs;
using Company_Project.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace Company_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]

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
        public async Task<IActionResult> AllLeaves()
        {
            var leaveList=_leaveRepository.GetAll();
            if(leaveList==null) return NotFound(new {message="No Employee Applied for leave"});
            return Ok(leaveList);
        }

        [HttpPost]
        [Route("UpdateLeaveStatus/{employeeId}")]
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
        public async Task<IActionResult> SpecificEmployeeLeaves(int employeeId)
        {
            var leaveList = _leaveRepository.FirstOrDefault(emp=>emp.EmployeeId==employeeId);
            if (leaveList == null) return NotFound(new { message = "No Employee Applied for leave" });
            return Ok(new { leaveList });
        }

    }
}
