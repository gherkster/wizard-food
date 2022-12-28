using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Database;

public record DbIngredient(string Name)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }

    public decimal? Amount { get; set; }
    public DbUnit? Unit { get; set; }
    public string Name { get; set; } = Name;
    public string Note { get; set; } = string.Empty;

    public DbIngredientGroup IngredientGroup { get; set; } = null!;
}