using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbSlug(string Label)
{
    [Key]
    public string Label { get; set; } = Label;
}