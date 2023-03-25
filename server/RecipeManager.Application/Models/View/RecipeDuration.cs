namespace RecipeManager.Application.Models.View;

public class RecipeDuration
{
    public RecipeDuration(string name)
    {
        Name = name;
    }
    
    public string Name { get; }
    public int Minutes { get; set; }
    public int Hours { get; set; }
    public int Days { get; set; }
}