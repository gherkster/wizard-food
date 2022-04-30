using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbCategory(string Label)
{
    [Key]
    public string Label { get; set; } = Label;
}