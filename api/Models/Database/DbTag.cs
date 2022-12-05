using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Database;

public record DbTag(string Label)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Label { get; set; } = Label;

    public List<DbRecipe> Recipes { get; set; } = null!;
}