using System;

namespace RecipeManager.AzureFunctions.Auth;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute
{
    public string[] Roles { get; set; }

    public AuthorizeAttribute(params string[] roles)
    {
        Roles = roles;
    }
}