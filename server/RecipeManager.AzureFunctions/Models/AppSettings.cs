namespace RecipeManager.AzureFunctions.Models;

public class AppSettings
{
    public string JwtKey { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string RecipeContainerName { get; set; } = string.Empty;
    public string UserContainerName { get; set; } = string.Empty;
    public string ConnectionString { get; set; } = string.Empty;
    public string CloudflareR2Url { get; set; } = string.Empty;
    public string CloudflareR2BucketName { get; set; } = string.Empty;
    public string CloudflareBucketAccessKey { get; set; } = string.Empty;
    public string CloudflareBucketSecretKey { get; set; } = string.Empty;
}
