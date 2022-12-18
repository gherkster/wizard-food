using System.Security.Claims;
using API.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

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
            ExpiresUtc = DateTimeOffset.Now.AddMinutes(30),
        };

        await _signInManager.SignInAsync(user, options);
        return Ok();
    }

    [HttpPost]
    [Route("Logout")]
    public async Task<ActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
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