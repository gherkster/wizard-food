namespace RecipeManager.AzureFunctions;

public static class Constants
{
    public const string JwtKey = "JwtKey";
    public const string DatabaseNameAppSetting = "DatabaseName";
    public const string RecipeContainerNameAppSetting = "RecipeContainerName";
    public const string UserContainerNameAppSetting = "UserContainerName";
    public const string ConnectionStringAppSetting = "CosmosDbConnectionString";
    public const string CloudflareR2Url = "CloudflareR2Url";
    public const string CloudflareR2BucketName = "CloudflareR2BucketName";
    public const string CloudflareBucketAccessKey = "CloudflareBucketAccessKey";
    public const string CloudflareBucketSecretKey = "CloudflareBucketSecretKey";
}
