using API.Models.Database;

namespace API.Models;

public class DropdownOptions
{
    public List<DbCategory> Categories { get; set; } = new();
    public List<DbCuisine> Cuisines { get; set; } = new();
    public List<DbCustomTimeLabel> CustomTimeTypes { get; set; } = new();
    public List<DbTag> Tags { get; set; } = new();
    public List<DbUnit> Units { get; set; } = new();
}
