namespace API.Models.View;

public class IngredientGroup
{
    public IngredientGroup(string name)
    {
        Name = name;
    }
    
    public string Name { get; }
    public List<Ingredient> Ingredients { get; set; } = new();
}

public class Ingredient
{
    public Ingredient(decimal amount, string unit, string name)
    {
        Amount = amount;
        Unit = unit;
        Name = name;
    }

    public decimal Amount { get; init; }
    public string Unit { get; init; }
    public string Name { get; }
    public string Note { get; init; } = string.Empty;
}