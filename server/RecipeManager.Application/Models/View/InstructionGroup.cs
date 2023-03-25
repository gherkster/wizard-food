namespace RecipeManager.WebAPI.Models.View;

public class InstructionGroup
{
    public string? Name { get; set; }
    public List<Instruction> Instructions { get; set; } = new();
}

public class Instruction
{
    public Instruction(string label)
    {
        Label = label;
    }

    public string Label { get; }
}