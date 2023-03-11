using API.Models.Core;

namespace API.Models.View;

public class IngredientGroup
{
    public string? Name { get; set; }
    public List<Ingredient> Ingredients { get; set; } = new();
}

public class Ingredient
{
    public Ingredient(string name)
    {
        Name = name;
    }

    public Fraction? Amount { get; init; } 
    public string Unit { get; init; } = string.Empty;
    public string Name { get; }
    public string Note { get; init; } = string.Empty;
}