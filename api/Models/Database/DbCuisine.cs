using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbCuisine(string Label)
{
    [Key]
    public string Label { get; set; } = Label;
}