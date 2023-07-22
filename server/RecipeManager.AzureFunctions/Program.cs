using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RecipeManager.Application.Services;
using RecipeManager.AzureFunctions.Auth;
using RecipeManager.AzureFunctions.Extensions;
using RecipeManager.AzureFunctions.Middleware;
using RecipeManager.AzureFunctions.Services;
using User = RecipeManager.Application.Auth.User;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults(builder =>
    {
        builder.UseMiddleware<AdminAuthorizationMiddleware>();
    })
    .ConfigureServices(services =>
    {
        // Bind app settings values to IOptions<AppSettings>
        services.AddConfigurationSettings();

        services.AddIdentityCore<User>()
            .AddUserStore<CosmosDbIdentityStore>();

        services.AddSingleton<IJwtTokenService, JwtTokenService>();
        services.AddJwtAuthentication();
        
        services.AddCosmosDbClient();
        services.AddCloudflareR2Client();

        services.AddSingleton<IMediaLibrary, MediaLibrary>();
        services.AddSingleton<IImageProcessor, ImageProcessor>();
        services.AddSingleton<IPersistenceProvider, D2PersistenceProvider>();

        services.Configure<JsonSerializerOptions>(options =>
        {
            // Match CosmosDB casing policy
            options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        });
    })
    .Build();

await host.RunAsync();
