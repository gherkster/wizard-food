using System.Net;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;
using RecipeManager.Application.Models.View;
using RecipeManager.AzureFunctions.Auth;
using RecipeManager.AzureFunctions.Models;

namespace RecipeManager.AzureFunctions.Functions;

[Authorize(Roles.AdminRole)]
public class DeleteRecipe
{
    private readonly CosmosClient _dbClient;
    private readonly AppSettings _settings;
    
    public DeleteRecipe(CosmosClient dbClient, IOptions<AppSettings> options)
    {
        _dbClient = dbClient;
        _settings = options.Value;
    }
    
    [Function("DeleteRecipe")]
    public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Function, "delete")] HttpRequestData req)
    {
        var recipeId = req.Query["id"];
        if (recipeId is null)
        {
            return req.CreateResponse(HttpStatusCode.BadRequest);
        }

        var container = _dbClient.GetContainer(_settings.DatabaseName, _settings.RecipeContainerName);
        await container.DeleteItemAsync<Recipe>(recipeId, new PartitionKey(recipeId));

        return req.CreateResponse(HttpStatusCode.OK);
    }
}
