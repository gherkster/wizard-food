using System.Security.Claims;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace RecipeManager.Application.Auth;

public class User : IdentityUser
{
    public List<string> Roles { get; set; } = new();

    [JsonIgnore]
    public bool IsAdmin => Roles.Contains(Constants.AdminClaim);
}
