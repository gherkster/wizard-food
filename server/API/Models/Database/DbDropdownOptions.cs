namespace API.Models.Database;

public class DbDropdownOptions
{
    public List<DbCategory> Categories { get; set; } = new();
    public List<DbCuisine> Cuisines { get; set; } = new();
    public List<DbCustomTimeLabel> CustomTimeTypes { get; set; } = new();
    public List<DbTag> Tags { get; set; } = new();
    public List<string> Units { get; set; } = new();
}
