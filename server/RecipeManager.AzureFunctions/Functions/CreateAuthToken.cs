using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using RecipeManager.Application.Auth;
using RecipeManager.AzureFunctions.Services;
using RecipeManager.WebAPI.Models;

namespace RecipeManager.AzureFunctions.Functions;

public class CreateAuthToken
{
    private readonly IJwtTokenService _tokenService;
    private readonly UserManager<User> _userManager;
    
    public CreateAuthToken(IJwtTokenService tokenService, UserManager<User> userManager)
    {
        _tokenService = tokenService;
        _userManager = userManager;
    }
    
    [Function("CreateAuthToken")]
    public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req)
    {
        var loginParameters = await req.ReadFromJsonAsync<LoginParameters>();
        if (string.IsNullOrWhiteSpace(loginParameters?.Username) || string.IsNullOrWhiteSpace(loginParameters?.Password))
        {
            return req.CreateResponse(HttpStatusCode.BadRequest);
        }

        var user = await _userManager.FindByNameAsync(loginParameters.Username);
        if (user is null)
        {
            return req.CreateResponse(HttpStatusCode.BadRequest);
        }

        var passwordMatchResult = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, loginParameters.Password);
        if (passwordMatchResult == PasswordVerificationResult.Failed)
        {
            return req.CreateResponse(HttpStatusCode.BadRequest);
        }

        var jwtToken = _tokenService.GenerateJwtToken(user);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteStringAsync(jwtToken);
        
        return response;
    }

    [Function("TestCreate")]
    public async Task<HttpResponseData> RunSomething(
        [HttpTrigger(AuthorizationLevel.Function, "post")]
        HttpRequestData req)
    {
        var token = req.Query["token"];

        var g = _tokenService.GetTokenClaims(token);
        
        return req.CreateResponse(HttpStatusCode.OK);
    }
    
    [Function("TestUpdate")]
    public async Task<HttpResponseData> RunElse(
        [HttpTrigger(AuthorizationLevel.Function, "post")]
        HttpRequestData req)
    {
        var loginParameters = await req.ReadFromJsonAsync<LoginParameters>();

        var user = await _userManager.FindByIdAsync("6a081866-1090-4af3-b2a3-793609ff2d69");
        user.Roles = new List<string>() { "admin" };

        await _userManager.UpdateAsync(user);
        return req.CreateResponse(HttpStatusCode.OK);
    }
}