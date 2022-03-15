using System;
using System.Collections.Generic;
using API.Models.Base;
using LiteDB;

namespace API.Models;

public class Recipe : DatabaseEntry
{
    public string Title { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;

    public List<RecipeListItem> Ingredients { get; set; } = new();
    public List<RecipeListItem> Instructions { get; set; } = new();

    public string Category { get; set; } = string.Empty;
    public string Cuisine { get; set; } = string.Empty;
    public int Servings { get; set; }
    public string ServingType { get; set; } = string.Empty;
    
    public decimal PreparationTime { get; set; }
    public Enums.DateTimeInterval PreparationTimeUnits { get; set; }
    public decimal CookingTime { get; set; }
    public Enums.DateTimeInterval CookingTimeUnits { get; set; }
    public decimal CustomTime { get; set; }
    public Enums.DateTimeInterval CustomTimeUnits { get; set; }
    public string CustomTimeLabel { get; set; } = string.Empty;
    
    public Nutrition? Nutrition { get; set; }
    
    public List<string> Tags { get; set; } = new();
    public string Slug { get; set; } = string.Empty;
}
