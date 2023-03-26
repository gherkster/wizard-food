namespace RecipeManager.Application.Models.View;

public class Recipe
{
    public Guid? Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public ImageMeta? CoverImage { get; set; }
    public string Note { get; set; } = string.Empty;

    public List<IngredientGroup> IngredientGroups { get; set; } = new();
    public List<InstructionGroup> InstructionGroups { get; set; } = new();

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