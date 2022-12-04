using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbCustomTime(TimeSpan CookingTime)
{
    [Key]
    public int Id { get; init; }
    public virtual DbCustomTimeLabel CustomTimeLabel { get; set; } = null!;
    public TimeSpan CookingTime { get; private set; } = CookingTime;
}