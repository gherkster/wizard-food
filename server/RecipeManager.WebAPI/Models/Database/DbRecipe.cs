using System.ComponentModel.DataAnnotations.Schema;

namespace RecipeManager.WebAPI.Models.Database;

public record DbRecipe
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    public string Title { get; set; } = string.Empty;
    public DbImageMeta? CoverImage { get; set; }
    public string Note { get; set; } = string.Empty;

    public virtual List<DbIngredientGroup> IngredientGroups { get; set; } = new();
    public virtual List<DbInstructionGroup> InstructionGroups { get; set; } = new();
    
    public TimeSpan PreparationTime { get; set; }
    public TimeSpan CookingTime { get; set; }
    public virtual List<DbCustomTime> CustomTimes { get; set; } = new();

    public virtual DbCategory Category { get; set; } = new(string.Empty);
    public virtual DbCuisine Cuisine { get; set; } = new(string.Empty);
    public decimal Servings { get; set; }

    public virtual List<DbTag> Tags { get; set; } = new();
    public decimal Rating { get; set; } = decimal.Zero;
    public string Slug { get; set; } = string.Empty;
}
