using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Models.Database;

public record DbTag(string Label)
{
    [Key]
    public string Label { get; set; } = Label;
    
    [JsonIgnore]
    public virtual ICollection<DbRecipe> Recipes { get; set; }
}