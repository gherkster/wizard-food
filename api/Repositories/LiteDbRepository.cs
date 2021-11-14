using API.Configs;
using API.Models;
using API.Repositories.Interfaces;
using LiteDB.Async;
using Microsoft.Extensions.Options;

namespace API.Repositories;

public class LiteDbRepository : ILiteDbRepository
{
    private readonly LiteDatabaseAsync _db;

    public LiteDbRepository(IOptions<DatabaseOptions> config)
    {
        _db = new LiteDatabaseAsync(config.Value.DatabasePath);
    }

    public async Task<Recipe?> GetRecipe(Guid id)
    {
        var collection = _db.GetCollection<Recipe>(nameof(Recipe)).Query();
        if (collection == null) return null;
        
        var recipe = await collection 
            .Where(x => x.Id == id)
            .FirstOrDefaultAsync();
        return recipe;
    }
    
    public ILiteQueryableAsync<Recipe> GetQueryableRecipes()
    {
        var collection = _db.GetCollection<Recipe>(nameof(Recipe));
        return collection.Query();
    }

    public async Task<Guid> CreateRecipe(Recipe recipe)
    {
        var collection = _db.GetCollection<Recipe>(nameof(Recipe));
        await collection.EnsureIndexAsync(x => x.Category);

        await collection.InsertAsync(recipe.Id, recipe);

        return recipe.Id;
    }

    public async Task UpdateRecipe(Guid id, Recipe recipe) => await _db.GetCollection<Recipe>(nameof(Recipe)).UpdateAsync(id, recipe);

    public async Task DeleteRecipe(Guid id) => await _db.GetCollection<Recipe>(nameof(Recipe)).DeleteAsync(id);

}