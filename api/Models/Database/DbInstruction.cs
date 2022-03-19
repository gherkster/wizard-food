using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbInstruction(Enums.ListItemType ItemType, string Label)
{
    [Key]
    public int Id { get; private set; }
    public Enums.ListItemType ItemType { get; set; } = ItemType;
    public string Label { get; set; } = Label;
}