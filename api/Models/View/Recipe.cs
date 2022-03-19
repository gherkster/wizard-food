namespace API.Models.View;

public class Recipe
{
    public string Title { get; set; } = string.Empty;

    public List<Ingredient> Ingredients { get; set; } = new();
    public List<Instruction> Instructions { get; set; } = new();

    public string Category { get; set; } = string.Empty;
    public string Cuisine { get; set; } = string.Empty;
    
    public int Servings { get; set; }
    public string ServingType { get; set; } = string.Empty;
    
    public int PreparationTimeDays { get; set; }
    public int PreparationTimeHours { get; set; }
    public int PreparationTimeMinutes { get; set; }
    
    public int CookingTimeDays { get; set; }
    public int CookingTimeHours { get; set; }
    public int CookingTimeMinutes { get; set; }
    public List<CustomTime> CustomTimes { get; set; } = new List<CustomTime>();

    public Nutrition Nutrition { get; set; } = new();
    
    public List<string> Tags { get; set; } = new();
    public string Slug { get; set; } = string.Empty;
}