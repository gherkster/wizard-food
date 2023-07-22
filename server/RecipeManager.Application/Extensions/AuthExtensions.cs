using System.Security.Claims;

namespace RecipeManager.Application.Extensions;

public static class AuthExtensions
{
    public static bool HasAdminClaim(this IEnumerable<Claim> claims)
    {
        return claims.Any(c => c.Type == Constants.AdminClaim);
    }
}