using System.Collections.Generic;
using API.Models;
using API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class RecipesController
{
    private readonly ILiteDbRepository _dbRepository;
    private readonly ILogger<RecipesController> _logger;

    public RecipesController(ILiteDbRepository dbRepository, ILogger<RecipesController> logger)
    {
        _dbRepository = dbRepository;
        _logger = logger;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Recipe>> GetRecipe([FromRoute] Guid id)
    {
        var recipe = await _dbRepository.GetRecipe(id);
        if (recipe == null)
        {
            return new NotFoundResult();
        }
        
        return recipe;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes([FromQuery] string? category, [FromQuery] string? cuisine)
    {
        var recipes = _dbRepository.GetQueryableRecipes();

        if (category is not null)
        {
            recipes = recipes.Where(r => r.Category == category);
        }
        if (cuisine is not null)
        {
            recipes = recipes.Where(r => r.Cuisine == cuisine);
        }
        
        return await recipes.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult> CreateRecipe(Recipe recipe)
    {
        var id = await _dbRepository.CreateRecipe(recipe);
        
        //return new CreatedAtActionResult(nameof(GetRecipe), nameof(RecipesController), new { id = recipe.Id}, recipe);
        return new CreatedResult(id.ToString(), recipe);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> UpdateRecipe(Guid id, Recipe recipe)
    {
        await _dbRepository.UpdateRecipe(id, recipe);
        return new OkResult();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteRecipe(Guid id)
    {
        await _dbRepository.DeleteRecipe(id);
        return new OkResult();
    }
}
