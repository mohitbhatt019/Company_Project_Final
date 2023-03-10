using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Company_Project.Models
{
    public class ApplicationUser:IdentityUser
    {
        public string? Salary { get; set; }
        public string? Name { get; set; }
        [NotMapped]
        public string? Role { get; set; }

      

    }
}
