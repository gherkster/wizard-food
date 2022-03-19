using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbIngredient(Enums.ListItemType ItemType, string Label, string Note)
{
    [Key]
    public int Id { get; private set; }
    public Enums.ListItemType ItemType { get; set; } = ItemType;
    public string Label { get; set; } = Label;
    public string Note { get; set; } = Note;
}