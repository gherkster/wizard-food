using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RecipeManager.Application;
using RecipeManager.WebAPI.Models;

namespace RecipeManager.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;

    public AuthController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }
    
    [HttpPost]
    [Route("Login")]
    public async Task<ActionResult> Login(LoginParameters login)
    {
        if (string.IsNullOrWhiteSpace(login.Username) || string.IsNullOrWhiteSpace(login.Password))
        {
            return BadRequest("Username and password required");
        }

        var user = await _userManager.FindByNameAsync(login.Username);
        if (user is null)
        {
            return BadRequest("Login failed");
        }

        var passwordMatchResult = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, login.Password);
        if (passwordMatchResult == PasswordVerificationResult.Failed)
        {
            // Return the same error as above so that the username being correct can't be inferred from a different error message
            return BadRequest("Login failed");
        }
        
        var options = new AuthenticationProperties()
        {
            AllowRefresh = true,
            ExpiresUtc = DateTimeOffset.Now.Add(Constants.SessionTimeout),
        };

        await _signInManager.SignInAsync(user, options);
        SetAuthHeaderValue(true);
        
        return Ok();
    }

    [HttpPost]
    [Route("Logout")]
    public async Task<ActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        SetAuthHeaderValue(false);
        
        return Ok();
    }

    private void SetAuthHeaderValue(bool isLoggedIn)
    {
        // Set Authenticated HTTP header manually for this request (outside of middleware), since
        // the HttpContext.User.Identity.IsAuthenticated boolean does not update until the next received request
        // https://stackoverflow.com/a/61282709
        if (HttpContext.Response.Headers.ContainsKey("Authenticated"))
        {
            HttpContext.Response.Headers["Authenticated"] = isLoggedIn.ToString().ToLower();
        }
        else
        {
            HttpContext.Response.Headers.Add("Authenticated", isLoggedIn.ToString().ToLower());
        }
    }

    // TODO: Remove test endpoint
    [HttpPost]
    [Route("CreateTestAdminAccount")]
    public async Task<ActionResult> CreateTestAdminAccount()
    {
        var user = new IdentityUser()
        {
            UserName = "admin",
        };

        await _userManager.CreateAsync(user, "Admin!1234");
        return Ok();
    }
}