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
public class RecipesController : ControllerBase
{
    private readonly DatabaseContext _db;
    private readonly ILogger<RecipesController> _logger;

    public RecipesController(DatabaseContext dbContext, ILogger<RecipesController> logger)
    {
        _db = dbContext;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes(string? query)
    {
        if (query is null)
        {
            var allRecipes = await _db.Recipes
                .AsNoTracking()
                .ToListAsync();
        
            return allRecipes.Select(r => r.AsViewModel()).ToList();
        }
        
        if (query.Length < 4)
        {
            return BadRequest("Enter at least 4 characters");
        }
        
        var recipes = await _db.Recipes
            .Where(r => r.Title.Contains(query)
                        || r.IngredientGroups.Any(ig => ig.Ingredients.Any(i => i.Name.Contains(query)))
                        || r.Category.Label == query
                        || r.Cuisine.Label == query
                        || r.Tags.Any(t => t.Label == query)
            ).ToListAsync();

        return recipes.Select(r => r.AsViewModel()).ToList();
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<Recipe>> GetRecipe(string slug)
    {
        var recipe = await _db.Recipes.Where(r => r.Slug == slug)
            .IncludeAllRelatedEntities()
            .AsNoTracking()
            .Select(r => r.AsViewModel())
            .FirstOrDefaultAsync();
        
        if (recipe == null)
        {
            return NotFound();
        }
        
        return recipe;
    }

    [HttpPost]
    public async Task<ActionResult> CreateRecipe(Recipe recipe)
    {
        var newDbRecipe = recipe.AsDatabaseModel();
        
        /*
         * We need to prevent duplicate entries from being added.
         * For example if the user already created a recipe with the Chinese category,
         * adding a new recipe which also has a category of Chinese would by default attempt to add a second Chinese Category entry.
         *
         * To avoid this issue, we set all linked database fields EXCEPT SLUG to the existing database field, if one exists.
         * This is matched by comparing the string value of the database field, rather than the whole record.
         * 
         * We need to do this because new values use the CLR default value for the ID, which is 0 for this database schema,
         * while the existing database values will already have an ID value set and would therefore not match when comparing records.
         *
         * The reason we do not match to an existing slug value, is that it is the only field that we need a consistent unique value per recipe,
         * otherwise link routing won't work.
         */
        
        var dbOptions = await _db.GetDropdownOptionsAsync();
        
        newDbRecipe.Category = dbOptions.Categories.FirstOrDefault(c => c.Label == newDbRecipe.Category.Label) ?? newDbRecipe.Category;
        newDbRecipe.Cuisine = dbOptions.Cuisines.FirstOrDefault(c => c.Label == newDbRecipe.Cuisine.Label) ?? newDbRecipe.Cuisine;
        
        foreach (var customTime in newDbRecipe.CustomTimes)
        {
            customTime.CustomTimeLabel =
                dbOptions.CustomTimeTypes.FirstOrDefault(ctt => ctt.Label == customTime.CustomTimeLabel.Label) ?? customTime.CustomTimeLabel;
        }
        newDbRecipe.Tags = newDbRecipe.Tags.Select(recipeTag => dbOptions.Tags.FirstOrDefault(dbTag => dbTag.Label == recipeTag.Label) ?? recipeTag).ToList();

        // Values which already exist in the database have been resolved above, and therefore have the database Key value set (Id). 
        // Because this is not the CLR default value, TrackGraph will treat the state as already Set, and hence an unchanged value and will not attempt to insert a new copy
        //
        // Note that this is why certain tables like Category have an ID column where traditionally they could just use the value as the Primary Key.
        // If the Primary Key was the string value, the above logic would not work and any non-empty string would be considered a new value that should be inserted into the DB.
        _db.ChangeTracker.TrackGraph(newDbRecipe, node => node.Entry.State = !node.Entry.IsKeySet ? EntityState.Added : EntityState.Unchanged);
        await _db.SaveChangesAsync();
        
        return Created(newDbRecipe.Id.ToString(), recipe);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> UpdateRecipe(Guid id, Recipe recipe)
    {
        var dbRecipe = await _db.Recipes.FindAsync(id);
        if (dbRecipe is null)
        {
            return NotFound();
        }
        
        _db.Entry(dbRecipe).CurrentValues.SetValues(recipe.AsDatabaseModel());
        await _db.SaveChangesAsync();
        
        return Ok();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteRecipe(Guid id)
    {
        var recipe = await _db.Recipes.FindAsync(id);
        if (recipe is null)
        {
            return NotFound();
        }
        
        _db.Recipes.Remove(recipe);
        await _db.SaveChangesAsync();
        
        return Ok();
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
