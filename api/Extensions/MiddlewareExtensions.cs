using API.Middleware;

namespace API.Extensions;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseAuthenticationHeader(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AuthenticatedHeaderMiddleware>();
    }
}