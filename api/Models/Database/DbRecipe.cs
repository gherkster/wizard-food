using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using API.Models.Database;

namespace API.Models.Database;

public record DbRecipe
{
    public int Id { get; private set; }
    public string Title { get; set; } = string.Empty;
    public virtual DbImage? Image { get; set; }

    public virtual List<DbIngredient> Ingredients { get; set; } = new();
    public virtual List<DbInstruction> Instructions { get; set; } = new();

    public virtual DbCategory Category { get; set; } = new(string.Empty);
    public virtual DbCuisine Cuisine { get; set; } = new(string.Empty);
    
    public decimal Servings { get; set; }
    public virtual DbServingType ServingType { get; set; } = new(string.Empty);
    
    public TimeSpan PreparationTime { get; set; }
    public TimeSpan CookingTime { get; set; }
    public TimeSpan CustomTime { get; set; }
    public virtual DbCustomTimeLabel? CustomTimeLabel { get; set; }
    
    public decimal? Energy { get; set; }
    public decimal? Protein { get; set; }
    public decimal? Carbohydrates { get; set; }
    public decimal? Fat { get; set; }
    public decimal? Sodium { get; set; }
    
    public virtual List<DbTag> Tags { get; set; } = new();
    public virtual DbSlug Slug { get; set; } = new(string.Empty);
}
