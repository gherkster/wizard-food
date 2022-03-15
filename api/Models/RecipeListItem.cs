using System.Text.Json.Serialization;
using API.Models.Base;
using LiteDB;

namespace API.Models;

public class RecipeListItem
{
    [JsonPropertyName("Type")]
    public Enums.ListItemType ItemType { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
}
