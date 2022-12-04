using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbTag(string Label)
{
    [Key]
    public int Id { get; set; }
    public string Label { get; set; } = Label;

    public List<DbRecipe> Recipes { get; set; } = null!;
}