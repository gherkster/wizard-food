namespace RecipeManager.WebAPI.Middleware;

/// <summary>
/// Set Authenticated custom HTTP header if the user is logged in with the defined authentication schema
/// Used by the frontend of an SPA application to keep track of a user's authentication status without
/// explicit calls to check authentication status
/// </summary>
public class AuthenticatedHeaderMiddleware
{
    private readonly RequestDelegate _next;

    public AuthenticatedHeaderMiddleware(RequestDelegate next)
    {
        _next = next;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        var isAuthenticated = context.User.Identity?.IsAuthenticated == true;
        context.Response.Headers.Add("Authenticated", isAuthenticated.ToString().ToLower());
        await _next(context);
    }
}