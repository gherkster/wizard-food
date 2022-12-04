using System.Collections.Generic;
using System.Net;
using API.Extensions;
using API.Models;
using API.Models.View;
using API.Models.Database.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipesController
{
    private readonly DatabaseContext _db;
    private readonly ILogger<RecipesController> _logger;

    public RecipesController(DatabaseContext dbContext, ILogger<RecipesController> logger)
    {
        _db = dbContext;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
    {
        var recipes = await _db.Recipes.AsNoTracking().ToListAsync();
        return recipes.Select(r => r.AsViewModel()).ToList();
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<Recipe>> GetRecipe(string slug)
    {
        var recipe = await _db.Recipes.Where(r => r.Slug == slug)
            //.Include(r => r.Ingredients)
            // .Include(r => r.Instructions)
            // .Include(r => r.Category)
            // .Include(r => r.Cuisine)
            // .Include(r => r.CustomTimeLabel)
            // .Include(r => r.Tags)
            .AsNoTracking()
            .Select(r => r.AsViewModel())
            .FirstOrDefaultAsync();
        
        if (recipe == null)
        {
            return new NotFoundResult();
        }
        
        return recipe;
    }

    [HttpPost]
    public async Task<ActionResult> CreateRecipe(Recipe recipe)
    {
        var newDbRecipe = recipe.AsDatabaseModel();

        // Prevent duplicate keys from being inserted by replacing all provided dropdown options
        // in the recipe with the matching database entity if it exists
        var dbOptions = await _db.GetDropdownOptionsAsync();
        
        newDbRecipe.Category = dbOptions.Categories.FirstOrDefault(c => c == newDbRecipe.Category) ?? newDbRecipe.Category;
        newDbRecipe.Cuisine = dbOptions.Cuisines.FirstOrDefault(c => c == newDbRecipe.Cuisine) ?? newDbRecipe.Cuisine;

        foreach (var customTime in newDbRecipe.CustomTimes)
        {
            customTime.CustomTimeLabel =
                dbOptions.CustomTimeTypes.FirstOrDefault(ctt => ctt == customTime.CustomTimeLabel) ?? customTime.CustomTimeLabel;
        }
        newDbRecipe.Tags = newDbRecipe.Tags.Select(recipeTag => dbOptions.Tags.FirstOrDefault(dbTag => dbTag == recipeTag) ?? recipeTag).ToList();

        await _db.Recipes.AddAsync(newDbRecipe);
        await _db.SaveChangesAsync();
        
        return new CreatedResult(newDbRecipe.Id.ToString(), recipe);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> UpdateRecipe(Guid id, Recipe recipe)
    {
        var dbRecipe = await _db.Recipes.FindAsync(id);
        if (dbRecipe is null)
        {
            return new NotFoundResult();
        }
        
        _db.Entry(dbRecipe).CurrentValues.SetValues(recipe.AsDatabaseModel());
        await _db.SaveChangesAsync();
        
        return new OkResult();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteRecipe(Guid id)
    {
        var recipe = await _db.Recipes.FindAsync(id);
        if (recipe is null)
        {
            return new NotFoundResult();
        }
        
        _db.Recipes.Remove(recipe);
        await _db.SaveChangesAsync();
        
        return new OkResult();
    }

    [HttpGet("slugs")]
    public async Task<ActionResult<string>> GetAvailableSlug(string chosenSlug)
    {
        var allSlugs = await _db.Recipes.Select(r => r.Slug).AsNoTracking().ToListAsync();
        if (allSlugs.All(s => s != chosenSlug))
        {
            return chosenSlug;
        }
        
        var slugsWithIdentifiers = allSlugs
            .Where(s => s.Contains(chosenSlug))                    // Check all the matching slugs in use ...
            .Where(s => char.IsDigit(chosenSlug[chosenSlug.Length - 1])) // which have an identifier appended.
            .ToList(); 

        // Now select just the identifier which is the maximum currently in use
        var largestSlugIdentifier = slugsWithIdentifiers.Count > 0
            ? slugsWithIdentifiers.Select(s => int.Parse(s[^1].ToString())).Max()
            : 0;

        return string.Concat(chosenSlug, "-", largestSlugIdentifier + 1);
    }

    [HttpGet("editor/dropdown-options")]
    public async Task<ActionResult<DropdownOptions>> GetDropdownOptions() => await _db.GetDropdownOptionsAsync();
}
