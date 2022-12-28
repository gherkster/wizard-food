using API.Models.Database;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class DatabaseExtensions
{
    /// <summary>
    /// Eager load all relevant navigation properties for the Recipe database entry
    /// </summary>
    public static IQueryable<DbRecipe> IncludeAllRelatedEntities(this IQueryable<DbRecipe> recipes)
    {
        return recipes.Include(r => r.IngredientGroups)
            .ThenInclude(ig => ig.Ingredients)
            .ThenInclude(i => i.Unit)
            .Include(r => r.InstructionGroups)
            .ThenInclude(ig => ig.Instructions)
            .Include(r => r.Category)
            .Include(r => r.Cuisine)
            .Include(r => r.CustomTimes)
            .ThenInclude(ct => ct.CustomTimeLabel)
            .Include(r => r.Tags);
    }
}