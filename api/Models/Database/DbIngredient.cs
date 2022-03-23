using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbIngredient(Enums.ListItemType ItemType, string Unit, decimal Amount, string Label, string Note)
{
    [Key]
    public int Id { get; private set; }
    public Enums.ListItemType ItemType { get; set; } = ItemType;
    public decimal Amount { get; set; } = Amount;
    public string Unit { get; set; } = Unit;
    public string Label { get; set; } = Label;
    public string Note { get; set; } = Note;
}