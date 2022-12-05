using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Database;

public record DbIngredient(string Unit, decimal Amount, string Name, string Note)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    public decimal Amount { get; set; } = Amount;
    public string Unit { get; set; } = Unit;
    public string Name { get; set; } = Name;
    public string Note { get; set; } = Note;

    public DbIngredientGroup IngredientGroup { get; set; } = null!;
}