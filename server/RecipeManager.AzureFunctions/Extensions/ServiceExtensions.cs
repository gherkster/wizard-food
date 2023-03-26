using System;
using Amazon.Runtime;
using Amazon.S3;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.DependencyInjection;

namespace RecipeManager.AzureFunctions.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddCosmosDbClient(this IServiceCollection services)
    {
        var connectionString = Environment.GetEnvironmentVariable(Constants.ConnectionStringAppSetting);
        services.AddSingleton(_ => new CosmosClient(connectionString));

        return services;
    }

    public static IServiceCollection AddCloudflareR2Client(this IServiceCollection services)
    {
        // Cloudflare uses an S3 compatible API for R2 object storage, so they are piggy backing off the amazon API package
        var cloudflareAccessKey = Environment.GetEnvironmentVariable(Constants.CloudflareBucketAccessKey);
        var cloudflareSecretKey = Environment.GetEnvironmentVariable(Constants.CloudflareBucketSecretKey);
        var cloudflareCredentials = new BasicAWSCredentials(cloudflareAccessKey, cloudflareSecretKey);
        services.AddSingleton(_ => new AmazonS3Client(cloudflareCredentials, new AmazonS3Config()
        {
            ServiceURL = Environment.GetEnvironmentVariable(Constants.CloudflareR2Url)
        }));

        return services;
    }
}