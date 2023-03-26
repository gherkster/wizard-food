using System;
using System.Collections.Generic;
using RecipeManager.Application.Models.Core;

namespace RecipeManager.AzureFunctions.Models;

public class DbRecipe
{
    public Guid? Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DbImageMeta? CoverImage { get; set; }
    public string Note { get; set; } = string.Empty;

    public List<DbIngredientGroup> IngredientGroups { get; set; } = new();
    public List<DbInstructionGroup> InstructionGroups { get; set; } = new();

    public string Category { get; set; } = string.Empty;
    public string Cuisine { get; set; } = string.Empty;
    public decimal Rating { get; set; } = decimal.Zero;
    
    public decimal Servings { get; set; }

    public RecipeDuration PreparationDuration { get; set; } = new("Preparation");
    public RecipeDuration CookingDuration { get; set; } = new("Cooking");
    public List<RecipeDuration> CustomDurations { get; set; } = new();
    
    public List<string> Tags { get; set; } = new();
    public string Slug { get; set; } = string.Empty;
}

public class DbIngredientGroup
{
    public string? Name { get; set; }
    public List<DbIngredient> Ingredients { get; set; } = new();
}

public class DbIngredient
{
    public DbIngredient(string name)
    {
        Name = name;
    }

    public Fraction? Amount { get; init; } 
    public string Unit { get; init; } = string.Empty;
    public string Name { get; }
    public string Note { get; init; } = string.Empty;
}

public class DbInstructionGroup
{
    public string? Name { get; set; }
    public List<string> Instructions { get; set; } = new();
}

public class RecipeDuration
{
    public RecipeDuration(string name)
    {
        Name = name;
    }
    
    public string Name { get; }
    public int Minutes { get; set; }
    public int Hours { get; set; }
    public int Days { get; set; }
}
