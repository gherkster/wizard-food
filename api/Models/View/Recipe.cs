namespace API.Models.View;

public class Recipe
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public List<Ingredient> Ingredients { get; set; } = new();
    public List<Instruction> Instructions { get; set; } = new();

    public string Category { get; set; } = string.Empty;
    public string Cuisine { get; set; } = string.Empty;
    public decimal Rating { get; set; } = decimal.Zero;
    
    public decimal Servings { get; set; }
    public string ServingType { get; set; } = string.Empty;

    public RecipeDuration PreparationTime { get; set; } = new();
    public RecipeDuration CookingTime { get; set; } = new();
    public RecipeDuration CustomTime { get; set; } = new();
    
    public string CustomTimeType { get; set; } = string.Empty;
    
    public Nutrition Nutrition { get; set; } = new();
    
    public List<string> Tags { get; set; } = new();
    public string Slug { get; set; } = string.Empty;
}