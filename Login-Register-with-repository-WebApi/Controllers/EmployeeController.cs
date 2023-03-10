using AutoMapper;
using Company_Project.Models;
using Company_Project.Models.DTO;
using Company_Project.Models.DTOs;
using Company_Project.Repository;
using Company_Project.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.Design;

namespace Company_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICompanyRepository _companyRepository;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IAuthenticateRepository _authenticateRepository;
        private readonly UserManager<ApplicationUser> _userManager;



        public EmployeeController(IEmployeeRepository employeeRepository, IMapper mapper, ApplicationDbContext context,
            ICompanyRepository companyRepository, RoleManager<IdentityRole> roleManager, IAuthenticateRepository authenticateRepository, UserManager<ApplicationUser> userManager)
        {
            _employeeRepository = employeeRepository;
            _mapper = mapper;
            _context = context;
            _companyRepository = companyRepository;
            _roleManager = roleManager;
            _authenticateRepository = authenticateRepository;
            _userManager = userManager;
        }

        //this method will add Employees and from here we can know that which employee belongs to which company
        //here i have add a check that if user is entering a random company id so first it will find in the database
        //that the companyId entered by user is exist or not
        [HttpPost]
        public async Task<IActionResult> AddEmployee(EmployeeDTO employeeDTO)
        {
            if(!(employeeDTO != null)&&(ModelState.IsValid))
            {
                return BadRequest(ModelState);
            }

            //**

            // Check if a "Company" employee already exists for the company
            var companyEmployees = _context.Employees.Where(e => e.CompanyId == employeeDTO.CompanyId).ToList();
            if (companyEmployees != null && companyEmployees.Any())
            {
                var existingCompanyEmployee = companyEmployees.Where(e => e.Role == UserRoles.Role_Company).ToList();
                if (existingCompanyEmployee.Count==1 && employeeDTO.Role==UserRoles.Role_Company)
                {
                    return BadRequest(new { message = "A 'Company' employee already exists for the company." });
                }
            }

            //**
            var employee = _mapper.Map<Employee>(employeeDTO);
            
            var userExists = await _authenticateRepository.IsUnique(employeeDTO.Username);
            if (userExists == null) return BadRequest(userExists);
            if(employeeDTO.Role=="")
            {
                employeeDTO.Role = UserRoles.Role_Employee;
            }
            var user = new ApplicationUser
            {
                UserName = employeeDTO.Username,
                Email = employeeDTO.Email,
                PasswordHash = employeeDTO.Password,
                Role = employeeDTO.Role,
            };


          

            var result = await _authenticateRepository.RegisterUser(user);
            employee.ApplicationUserId = user.Id;
            _employeeRepository.Add(employee);
            if (!result) return StatusCode(StatusCodes.Status500InternalServerError);

            //Here i am checking if any Company User exist

            //Here i am saving ApplicationUserId of CompanyUser in Company Table

            if (employeeDTO.Role == UserRoles.Role_Company)
            {
                var companyId = employeeDTO.CompanyId;
                var companyInDb = _context.Companies.Find(companyId);
                if (companyInDb == null) return NotFound(new { message = "company Not exist" });
                companyInDb.ApplicationUserId = employee.ApplicationUserId;
                _context.SaveChanges();
            }
            return Ok(new { Message = "Register successfully!!!" }); 
        }

        //This method will give the list of employees
        [HttpGet]
        public IActionResult GetEmployees()
        {
            var employeeList = _employeeRepository.GetAll();
            if(employeeList ==null) return NotFound(new { message = "No Employee Found" });
            return Ok(employeeList);
        }

        //This method will update the employees
        [HttpPut]
        public IActionResult UpdateEmployee(EmployeeDTO employeeDTO)
        {
            if (!(employeeDTO != null) && (ModelState.IsValid))
            {
                return BadRequest(ModelState);
            }

            var employee = _mapper.Map<Employee>(employeeDTO);
            _employeeRepository.Update(employee);
            return Ok(new { message = "Employee Updated Sucessfully" });
        }

        //This method will delete the employee
        [HttpDelete]
        public IActionResult DeleteEmployees(int employeeId)
        {
            if (employeeId == 0) return NotFound();
            var employee = _employeeRepository.Get(employeeId);

            var empInDsg = _context.employeeDesignations.Where(a => a.EmployeeId == employeeId).ToList();
            if (empInDsg.Count !=0) { _context.employeeDesignations.RemoveRange(empInDsg); }

                _employeeRepository.Remove(employeeId);
                var user = _userManager.FindByIdAsync(employee.ApplicationUserId).Result;

            // Delete the user's identity records
            var logins = _userManager.GetLoginsAsync(user).Result;
            foreach (var login in logins)
            {
                var result = _userManager.RemoveLoginAsync(user, login.LoginProvider, login.ProviderKey).Result;
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }
            }
            var roles = _userManager.GetRolesAsync(user).Result;
            foreach (var role in roles)
            {
                var result = _userManager.RemoveFromRoleAsync(user, role).Result;
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }
            }
            var result2 = _userManager.DeleteAsync(user).Result;
            if (!result2.Succeeded)
            {
                return BadRequest(result2.Errors);
            }


            return Ok(new { message = "Employee Deleted Sucessfully", status = 1 });

        }
    }
}
