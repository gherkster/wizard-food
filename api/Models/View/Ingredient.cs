namespace API.Models.View;

public class Ingredient
{
    public Ingredient(Enums.ListItemType itemType, string label)
    {
        ItemType = itemType;
        Label = label;
    }

    public Enums.ListItemType ItemType { get; set; }
    public decimal Amount { get; set; } = decimal.Zero;
    public string Unit { get; set; } = string.Empty;
    public string Label { get; set; }
    public string Note { get; set; } = string.Empty;
}