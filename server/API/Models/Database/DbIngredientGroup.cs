using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Database;

public record DbIngredientGroup()
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }

    public string? Name { get; set; }
    public virtual List<DbIngredient> Ingredients { get; set; } = new();
}