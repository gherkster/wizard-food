using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbIngredient(string Unit, decimal Amount, string Name, string Note)
{
    [Key]
    public int Id { get; init; }
    public decimal Amount { get; set; } = Amount;
    public string Unit { get; set; } = Unit;
    public string Name { get; set; } = Name;
    public string Note { get; set; } = Note;
}