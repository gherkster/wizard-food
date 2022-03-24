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
        var recipes = await _db.Recipes.ToListAsync();
        return recipes.Select(r => r.AsViewModel()).ToList();
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<Recipe>> GetRecipe(string slug)
    {
        var recipe = await _db.Recipes.Where(r => r.Slug.Label == slug).FirstOrDefaultAsync();
        if (recipe == null)
        {
            return new NotFoundResult();
        }
        
        return recipe.AsViewModel();
    }

    [HttpPost]
    public async Task<ActionResult> CreateRecipe(Recipe recipe)
    {
        var dbRecipe = recipe.AsDatabaseModel();

        // Prevent duplicate keys from being inserted by replacing all provided dropdown options
        // in the recipe with the matching database entity if it exists
        var dbOptions = await _db.GetDropdownOptionsAsync();
        
        dbRecipe.Category = dbOptions.Categories.FirstOrDefault(c => c == dbRecipe.Category) ?? dbRecipe.Category;
        dbRecipe.Cuisine = dbOptions.Cuisines.FirstOrDefault(c => c == dbRecipe.Cuisine) ?? dbRecipe.Cuisine;
        dbRecipe.CustomTimeLabel = dbOptions.CustomTimeTypes.FirstOrDefault(ctl => ctl == dbRecipe.CustomTimeLabel) ??
                                   dbRecipe.CustomTimeLabel;
        dbRecipe.ServingType = dbOptions.ServingTypes.FirstOrDefault(st => st == dbRecipe.ServingType) ??
                               dbRecipe.ServingType;
        dbRecipe.Tags = dbRecipe.Tags.Select(recipeTag => dbOptions.Tags.FirstOrDefault(dbTag => dbTag == recipeTag) ?? recipeTag).ToList();

        await _db.Recipes.AddAsync(dbRecipe);
        await _db.SaveChangesAsync();
        
        return new CreatedResult(dbRecipe.Id.ToString(), recipe);
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
        var dbSlug = await _db.Slugs.FindAsync(chosenSlug);
        if (dbSlug is null)
        {
            return chosenSlug;
        }

        var allSlugs = _db.Slugs.AsQueryable();
        
        var slugsWithIdentifiers = await allSlugs
            .Where(s => s.Label.Contains(chosenSlug))                    // Check all the matching slugs in use ...
            .Where(s => char.IsDigit(chosenSlug[chosenSlug.Length - 1])) // which have an identifier appended.
            .ToListAsync(); 

        // Now select just the identifier which is the maximum currently in use
        var largestSlugIdentifier = slugsWithIdentifiers.Count > 0
            ? slugsWithIdentifiers.Select(s => int.Parse(s.Label[^1].ToString())).Max()
            : 0;

        return string.Concat(chosenSlug, "-", largestSlugIdentifier + 1);
    }

    [HttpGet("editor/dropdown-options")]
    public async Task<ActionResult<DropdownOptions>> GetDropdownOptions() => await _db.GetDropdownOptionsAsync();
}
