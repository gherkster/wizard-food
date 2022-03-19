namespace API.Models.View;

public class Ingredient
{
    public Ingredient(Enums.ListItemType itemType, string label, string note)
    {
        ItemType = itemType;
        Label = label;
        Note = note;
    }

    public Enums.ListItemType ItemType { get; set; }
    public string Label { get; set; }
    public string Note { get; set; }
}