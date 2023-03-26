using System.ComponentModel.DataAnnotations.Schema;

namespace RecipeManager.WebAPI.Models.Database;

public record DbInstruction(string Label)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    public string Label { get; set; } = Label;

    public DbInstructionGroup InstructionGroup { get; set; } = null!;
}