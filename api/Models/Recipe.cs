using System;
using System.Collections.Generic;
using API.Models.Base;
using LiteDB;

namespace API.Models;

public class Recipe : DatabaseEntry
{
    public string Title { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;

    public string IngredientsSectionTitle { get; set; } = string.Empty;
    public IEnumerable<IngredientsSection> Ingredients { get; set; } = new List<IngredientsSection>();

    public string InstructionsSectionTitle { get; set; } = string.Empty;
    public IEnumerable<InstructionsSection> Instructions { get; set; } = new List<InstructionsSection>();
    
    public string Category { get; set; } = string.Empty;
    public string Cuisine { get; set; } = string.Empty;
    public int Servings { get; set; }
    public string ServingType { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    
    public TimeSpan PreparationTime { get; set; }
    public TimeSpan CookingTime { get; set; }
    public TimeSpan CustomTime { get; set; }
    public string CustomTimeLabel { get; set; } = string.Empty;
    
    public Nutrition? Nutrition { get; set; }
    
    public IEnumerable<Tag> Tags { get; set; } = new List<Tag>();
    public string Slug { get; set; } = string.Empty;
}
