using System.ComponentModel.DataAnnotations.Schema;

namespace RecipeManager.WebAPI.Models.Database;

public record DbInstructionGroup()
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }

    public string? Name { get; set; }
    public virtual List<DbInstruction> Instructions { get; set; } = new();
}