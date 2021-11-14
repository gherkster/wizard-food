using API.Models;
using LiteDB.Async;

namespace API.Repositories.Interfaces;

public interface ILiteDbRepository
{
    public Task<Recipe?> GetRecipe(Guid id);
    public ILiteQueryableAsync<Recipe> GetQueryableRecipes();
    public Task<Guid> CreateRecipe(Recipe recipe);
    public Task UpdateRecipe(Guid id, Recipe recipe);
    public Task DeleteRecipe(Guid id);
}