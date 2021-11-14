namespace API.Models;

public class InstructionsSection
{
    public string Title { get; set; } = string.Empty;
    public IEnumerable<Instruction>? Instructions { get; set; }
}

public class Instruction
{
    public string Text { get; set; }
    public string Note { get; set; }
}
