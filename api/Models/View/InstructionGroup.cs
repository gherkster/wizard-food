namespace API.Models.View;

public class InstructionGroup
{
    public InstructionGroup(string name)
    {
        Name = name;
    }
    
    public string Name { get; }
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