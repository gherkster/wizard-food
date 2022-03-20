using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbCustomTimeLabel(string Label)
{
    [Key]
    public string Label { get; set; } = Label;

    public virtual List<DbCustomTime> CustomTimes { get; set; }
}