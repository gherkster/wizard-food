using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbInstruction(string Label)
{
    [Key]
    public int Id { get; init; }
    public string Label { get; set; } = Label;
}