using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using RecipeManager.Application.Models.View;
using RecipeManager.AzureFunctions.Extensions;
using RecipeManager.AzureFunctions.Models;

namespace RecipeManager.AzureFunctions.Functions;

public static class UpsertRecipe
{
    [Function("UpsertRecipe")]
    public static async Task<CreateRecipeResponse> RunAsync(
        [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req)
    {
        var recipe = await req.ReadFromJsonAsync<Recipe>();

        if (recipe is null)
        {
            return new CreateRecipeResponse()
            {
                ResponseData = req.CreateResponse(HttpStatusCode.BadRequest)
            };
        }
        
        var dbRecipe = recipe.ToDatabaseModel();
        dbRecipe.Id ??= Guid.NewGuid();
        
        // TODO: Validation

        return new CreateRecipeResponse()
        {
            Recipe = dbRecipe
        };
    }
}

public class CreateRecipeResponse
{
    [CosmosDBOutput($"%{Constants.DatabaseNameAppSetting}%", 
        $"%{Constants.ContainerNameAppSetting}%",
        Connection = $"{Constants.ConnectionStringAppSetting}")]
    public DbRecipe? Recipe { get; init; }

    public HttpResponseData ResponseData { get; set; }
}