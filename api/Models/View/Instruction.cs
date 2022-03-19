namespace API.Models.View;

public class Instruction
{
    public Instruction(Enums.ListItemType itemType, string label)
    {
        ItemType = itemType;
        Label = label;
    }

    public Enums.ListItemType ItemType { get; set; }
    public string Label { get; set; }
}