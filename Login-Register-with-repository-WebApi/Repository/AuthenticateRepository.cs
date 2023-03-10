using Company_Project.Models;
using Company_Project.Repository.IRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Company_Project.Repository
{
    public class AuthenticateRepository : IAuthenticateRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;


        public AuthenticateRepository(UserManager<ApplicationUser> userManager)
        {
            _userManager= userManager;

        }
        public async Task<ApplicationUser> AuthenticateUser(string userName, string userPassword)
        {
            var user = await _userManager.FindByNameAsync(userName);
            bool VERIFY = await _userManager.CheckPasswordAsync(user, userPassword);
            if (VERIFY == true)
                //admin
             //await _userManager.AddToRoleAsync(user, UserRoles.Role_Admin);
            return user;
            return null;

         }
        public async Task<bool> IsUnique(string userName)
        {
            var duplicateUser=await _userManager.FindByNameAsync(userName);
            if (duplicateUser != null) { return false; } else { return true; }
        }

        public async Task<bool> RegisterUser(ApplicationUser registerModel)
        {
            var user = await _userManager.CreateAsync(registerModel, registerModel.PasswordHash);
            //await _userManager.AddToRoleAsync(registerModel, UserRoles.Role_Admin);

            if (!user.Succeeded) return false;
         

            else
                await _userManager.AddToRoleAsync(registerModel, registerModel.Role); 
            return true;

        }
    }
}
