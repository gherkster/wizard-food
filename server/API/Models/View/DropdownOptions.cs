namespace API.Models.View;

public class DropdownOptions
{
    public List<string> Categories { get; set; } = new();
    public List<string> Cuisines { get; set; } = new();
    public List<string> CustomTimeTypes { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public List<string> Units { get; set; } = new();
}