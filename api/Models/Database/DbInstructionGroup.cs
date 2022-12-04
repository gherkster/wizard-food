using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbInstructionGroup(string Name)
{
    [Key]
    public int Id { get; init; }

    public string Name { get; set; } = Name;
    public virtual List<DbInstruction> Instructions { get; set; } = new();
}