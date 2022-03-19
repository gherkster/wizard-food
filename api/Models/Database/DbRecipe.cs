using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using API.Models.Database;

namespace API.Models.Database;

public record DbRecipe
{
    public int Id { get; private set; }
    public string Title { get; set; } = string.Empty;
    public DbImage? Image { get; set; }

    public List<DbIngredient> Ingredients { get; set; } = new();
    public List<DbInstruction> Instructions { get; set; } = new();

    public DbCategory Category { get; set; } = new(string.Empty);
    public DbCuisine Cuisine { get; set; } = new(string.Empty);
    
    public int Servings { get; set; }
    public DbServingType ServingType { get; set; } = new(string.Empty);
    
    public TimeSpan PreparationTime { get; set; }
    public TimeSpan CookingTime { get; set; }
    public List<DbCustomTime> CustomTimes { get; set; } = new();
    
    public decimal? Energy { get; set; }
    public decimal? Protein { get; set; }
    public decimal? Carbohydrates { get; set; }
    public decimal? Fat { get; set; }
    public decimal? Sodium { get; set; }
    
    public List<DbTag> Tags { get; set; } = new();
    public DbSlug Slug { get; set; } = new(string.Empty);
}
