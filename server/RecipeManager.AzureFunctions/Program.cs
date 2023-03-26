using System;
using System.Configuration;
using System.Text.Json;
using Amazon.Runtime;
using Amazon.S3;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RecipeManager.Application.Services;
using RecipeManager.AzureFunctions;
using RecipeManager.AzureFunctions.Extensions;
using RecipeManager.AzureFunctions.Services;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        services.AddCosmosDbClient();
        services.AddCloudflareR2Client();

        services.AddSingleton<IMediaLibrary, MediaLibrary>();
        services.AddSingleton<IImageProcessor, ImageProcessor>();
        services.AddSingleton<IPersistenceProvider, D2PersistenceProvider>();

        // Bind app settings values to IOptions<AppSettings>
        services.AddConfigurationSettings();
        
        services.Configure<JsonSerializerOptions>(options =>
        {
            // Match CosmosDB casing policy
            options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        });
    })
    .Build();
    
await host.RunAsync();
