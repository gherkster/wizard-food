using System.ComponentModel.DataAnnotations.Schema;
using RecipeManager.Application.Models.Core;

namespace RecipeManager.WebAPI.Models.Database;

public record DbIngredient(string Name)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }

    public Fraction? Amount { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string Name { get; set; } = Name;
    public string Note { get; set; } = string.Empty;

    public DbIngredientGroup IngredientGroup { get; set; } = null!;
}