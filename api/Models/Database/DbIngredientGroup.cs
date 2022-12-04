using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbIngredientGroup(string Name)
{
    [Key]
    public int Id { get; init; }

    public string Name { get; private set; } = Name;
    public virtual List<DbIngredient> Ingredients { get; set; } = new();
}