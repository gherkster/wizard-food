using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Database;

public record DbUnit(string Label)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    public string Label { get; set; } = Label;

    public List<DbIngredient> Ingredients = null!;
}