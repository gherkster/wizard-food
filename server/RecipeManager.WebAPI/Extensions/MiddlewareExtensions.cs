using RecipeManager.WebAPI.Middleware;

namespace RecipeManager.WebAPI.Extensions;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseAuthenticationHeader(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AuthenticatedHeaderMiddleware>();
    }
}