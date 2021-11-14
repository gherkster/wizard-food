using API.Models.Base;
using LiteDB;

namespace API.Models;

public class IngredientsSection
{
    public string Title { get; set; } = string.Empty;
    public IEnumerable<Ingredient>? Ingredients { get; set; }
}

public class Ingredient
{
    public decimal Amount { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;

    public string Note { get; set; } = string.Empty;
}
