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

        // Method to authenticate a user with their username and password
        public async Task<ApplicationUser> AuthenticateUser(string userName, string userPassword)
        {
            // Find the user with the given username
            var user = await _userManager.FindByNameAsync(userName);

            // Verify the user's password
            bool VERIFY = await _userManager.CheckPasswordAsync(user, userPassword);

            // If the password is correct, return the user
            if (VERIFY == true)
                //admin
             //await _userManager.AddToRoleAsync(user, UserRoles.Role_Admin);
            return user;
            return null;

         }

        // Method to check if a username is unique
        public async Task<bool> IsUnique(string userName)
        {
            // Find a user with the given username
            var duplicateUser =await _userManager.FindByNameAsync(userName);

            // If a user with the same username is found, return false
            if (duplicateUser != null) { return false; }

            // If no user with the same username is found, return true
            else { return true; }
        }

        // Method to register a new user
        public async Task<bool> RegisterUser(ApplicationUser registerModel)
        {
            // Create a new user with the given registerModel and password
            var user = await _userManager.CreateAsync(registerModel, registerModel.PasswordHash);
            //await _userManager.AddToRoleAsync(registerModel, UserRoles.Role_Admin);


            // If user creation fails, return false
            if (!user.Succeeded) return false;

            // If user creation succeeds, add the user to their assigned role and return true
            else
                await _userManager.AddToRoleAsync(registerModel, registerModel.Role); 
            return true;

        }
    }
}
