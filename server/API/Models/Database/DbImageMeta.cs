using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Database;

public record DbImageMeta
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public Guid Id { get; init; }
    public string DisplayName { get; set; } = string.Empty;
    public int AspectRatioX { get; set; } = 1;
    public int AspectRatioY { get; set; } = 1;

    public virtual List<DbRecipe> Recipes { get; set; } = null!;
}