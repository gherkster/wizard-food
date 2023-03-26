using System.ComponentModel.DataAnnotations.Schema;

namespace RecipeManager.WebAPI.Models.Database;

public record DbCustomTime(TimeSpan CookingTime)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    public TimeSpan CookingTime { get; set; } = CookingTime;

    public virtual DbRecipe Recipe { get; set; } = null!;
    public virtual DbCustomTimeLabel CustomTimeLabel { get; set; } = null!;
}