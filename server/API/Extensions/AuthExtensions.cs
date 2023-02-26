using API.Models.Database.Context;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;

namespace API.Extensions;

public static class AuthExtensions
{
    /// <summary>
    /// Setup cookie based authentication
    /// </summary>
    public static IServiceCollection ConfigureAuthentication(this IServiceCollection services)
    {
        services.AddIdentity<IdentityUser, IdentityRole>().AddEntityFrameworkStores<DatabaseContext>();

        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie();
        services.ConfigureApplicationCookie(options =>
        {
            options.Cookie.HttpOnly = true;
            options.Cookie.SameSite = SameSiteMode.Strict;
        });

        return services;
    }
}