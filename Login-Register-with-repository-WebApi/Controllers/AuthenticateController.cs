using Company_Project.Models;
using Company_Project.Repository.IRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Company_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IAuthenticateRepository _authenticateRepository;
        private readonly ITokenService _tokenService;
        private readonly ApplicationDbContext _context;
        private readonly ICompanyRepository _companyRepository;




        public AuthenticateController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IAuthenticateRepository authenticateRepository, ITokenService tokenService, ApplicationDbContext context,
            ICompanyRepository companyRepository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _authenticateRepository = authenticateRepository;
            _tokenService = tokenService;
            _context = context;
            _companyRepository = companyRepository;

        }
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel registerModel)
        {

            // Check if the data in the request body is valid
            if (!ModelState.IsValid) return BadRequest();

            // Check if the username is unique
            var userExists = await _authenticateRepository.IsUnique(registerModel.Username);
           if (userExists == null) return BadRequest(userExists);

           //Here we checking that user email is registed with any company or not, if not then it show error
            bool checkEmail = await _context.Users.AnyAsync(a => a.Email == registerModel.Email);
            if (checkEmail) return BadRequest(new { message = "User alredy Exist in company" });

            // Create a new ApplicationUser 
            var user = new ApplicationUser
            {
                UserName = registerModel.Username,
                Email = registerModel.Email,
                PasswordHash=registerModel.Password,
                Role=registerModel.Role
            };

            // Attempt to register the user with the repository
            var result = await _authenticateRepository.RegisterUser(user);

            // If registration was not successful, return a 500 error
            if (!result) return StatusCode(StatusCodes.Status500InternalServerError);

            // If registration was successful, return a success message
            return Ok(new { Message = "Register successfully!!!" });
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult>Login(LoginModel loginModel)
        {
            // Check if the user is registered
            if (await _authenticateRepository.IsUnique(loginModel.Username)) 
                return BadRequest(new { Message = "Please Register first then login!!!" });

            // Authenticate the user
            var users = await _authenticateRepository.AuthenticateUser(loginModel.Username, loginModel.Password);
            if (users == null) return Unauthorized();

            // Retrieve the user  from the user manager
            var user = await _userManager.FindByNameAsync(loginModel.Username);

            // Check if the user's credentials are valid
            if (user != null && await _userManager.CheckPasswordAsync(user, loginModel.Password))
            {
                // Retrieve the user's details from AspNetUsers
                var UserDetail = _context.Users.ToList().Where(a => a.UserName == loginModel.Username).FirstOrDefault();

                // Retrieve the user's roles
                var roles = await _userManager.GetRolesAsync(user);

                // Set the user's role string to the first role in the roles list
                var userRoles = await _userManager.GetRolesAsync(user);
                var userRoleString = userRoles.Count > 0 ? userRoles[0] : "";

                // Create a list of claims for the authentication token
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name,user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                };

                // Add a claim for each role in the user's roles list
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                // Generate a new authentication token and refresh token
                var token = _tokenService.GetToken(authClaims);
                var refreshToken = _tokenService.GetRefreshToken();

                // Retrieve the token info object from the context, or create a new one if it doesn't exist
                var tokenInfo = _context.TokenInfo.FirstOrDefault(a => a.Username == user.UserName);
                if (tokenInfo == null)
                {
                    // If the token info object doesn't exist, create a new one and save it to the database
                    var info = new TokenInfo
                    {
                        Username = user.UserName,
                        RefreshToken = refreshToken,
                        RefreshTokenExpiry = DateTime.Now.AddDays(7)
                    };
                    _context.TokenInfo.Add(info);
                    _context.SaveChanges();
                }
                else
                {    // If the token info object exists, update its refresh token and expiry and save the changes to the database
                    tokenInfo.RefreshToken = refreshToken;
                    tokenInfo.RefreshTokenExpiry = DateTime.Now.AddDays(7);
                }
                try
                {
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    // If there's an error saving the changes to the database, return a bad request with the error message
                    return BadRequest(ex.Message);
                }

                // Return an Ok response with the login response object 
                return Ok(new LoginResponse
                {
                    Name = user.Name,
                    Username = user.UserName,
                    Token = token.TokenString,
                    RefreshToken = refreshToken,
                    Expiration = token.ValidTo,
                    StatusCode = 1,
                    Message = "Logged In",
                    Role =userRoleString
                });;
            }

            // Return an Ok response with a login response object indicating that the username or password is invalid
            return Ok(
                new LoginResponse
                {
                    StatusCode = 0,
                    Message = "Invalid Username or password",
                    Token = "",
                    Expiration = null
                });

            // Return an Ok response with a message indicating that the login was successfull
            return Ok(new { Message = "Login successfully!!!" });

        }

        #region RefreshToken
        // This method is used to refresh access tokens when they expire
        [HttpPost]
        [Route("Refresh")]
        public IActionResult Refresh(RefreshTokenRequest tokenApiModel)
        {
            // If the request is invalid or null), return a BadRequest response
            if (tokenApiModel is null)
                return BadRequest("Invalid client request");

            // Get the access token and refresh token from the request
            string accessToken = tokenApiModel.AccessToken;
            string refreshToken = tokenApiModel.RefreshToken;

            // Get the claims principal from the expired access token
            var principal = _tokenService.GetPrincipleFromExpiredToken(accessToken);

            // Get the username from the claims principal
            var username = principal.Identity.Name;

            // Get the user from the context using the username
            var user = _context.TokenInfo.SingleOrDefault(u => u.Username == username);

            // If the user is null, the refresh token is invalid, or the refresh token has expired, return a BadRequest response
            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiry <= DateTime.Now)
                return BadRequest("Invalid client Request");

            // Generate a new access token and refresh token
            var newAccessToken = _tokenService.GetToken(principal.Claims);
            var newRefreshToken = _tokenService.GetRefreshToken();

            // Update the user's refresh token in the context
            user.RefreshToken = newRefreshToken;
            _context.SaveChanges();

            // Return a new RefreshTokenRequest containing the new access token and refresh token
            return Ok(new RefreshTokenRequest()
            {
                AccessToken = newAccessToken.TokenString,
                RefreshToken = newRefreshToken
            });
        }
        #endregion

    }
}
