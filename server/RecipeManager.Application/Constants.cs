namespace RecipeManager.Application;

public static class Constants
{
    public static readonly TimeSpan SessionTimeout = TimeSpan.FromMinutes(30);
    public const string AdminClaim = "admin";
    public const string IdClaim = "sub";
}