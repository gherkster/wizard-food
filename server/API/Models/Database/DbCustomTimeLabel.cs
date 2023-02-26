using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Database;

public record DbCustomTimeLabel(string Label)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    public string Label { get; set; } = Label;

    public virtual List<DbCustomTime> DbCustomTimes { get; init; } = new();
}