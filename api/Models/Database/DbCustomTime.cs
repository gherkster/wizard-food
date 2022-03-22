using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbCustomTime(TimeSpan CustomTime)
{
    [Key]
    public int Id { get; private set; }
    public TimeSpan CustomTime { get; set; } = CustomTime;

    public virtual DbRecipe Recipe { get; set; }
    public int RecipeId { get; set; }
    public virtual DbCustomTimeLabel Label { get; set; } = new DbCustomTimeLabel(string.Empty);
    public string LabelId { get; set; }
}