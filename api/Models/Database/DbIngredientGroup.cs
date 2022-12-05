using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Database;

public record DbIngredientGroup(string Name)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }

    public string Name { get; private set; } = Name;
    public virtual List<DbIngredient> Ingredients { get; set; } = new();
}