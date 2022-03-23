using API.Models;
using API.Models.Database;
using API.Models.View;

namespace API.Extensions;

public static class MappingExtensions
{
    public static Recipe AsViewModel(this DbRecipe dbRecipe)
    {
        var recipe = new Recipe()
        {
            Title = dbRecipe.Title,
            Ingredients = dbRecipe.Ingredients.Select(ing => 
                new Ingredient(ing.ItemType, ing.Label) { Amount = ing.Amount, Unit = ing.Unit, Note = ing.Note }).ToList(),
            Instructions = dbRecipe.Instructions.Select(ins => 
                new Instruction(ins.ItemType, ins.Label)).ToList(),
            
            Category = dbRecipe.Category.Label,
            Cuisine = dbRecipe.Cuisine.Label,
            Servings = dbRecipe.Servings,
            ServingType = dbRecipe.ServingType.Label,
            
            PreparationTimeDays = dbRecipe.PreparationTime.Days,
            PreparationTimeHours = dbRecipe.PreparationTime.Hours,
            PreparationTimeMinutes = dbRecipe.PreparationTime.Minutes,
            CookingTimeDays = dbRecipe.CookingTime.Days,
            CookingTimeHours = dbRecipe.CookingTime.Hours,
            CookingTimeMinutes = dbRecipe.CookingTime.Minutes,
            CustomTimeDays = dbRecipe.CustomTime.Days,
            CustomTimeHours = dbRecipe.CustomTime.Hours,
            CustomTimeMinutes = dbRecipe.CustomTime.Minutes,
            CustomTimeType = dbRecipe.CustomTimeLabel?.Label ?? string.Empty,
            
            Nutrition = new Nutrition()
            {
                Energy = dbRecipe.Energy,
                Carbohydrates = dbRecipe.Carbohydrates,
                Protein = dbRecipe.Protein,
                Fat = dbRecipe.Fat,
                Sodium = dbRecipe.Sodium
            },
            
            Tags = dbRecipe.Tags.Select(t => t.Label).ToList(),
            Slug = dbRecipe.Slug.Label
        };

        return recipe;
    }

    public static DbRecipe AsDatabaseModel(this Recipe recipe)
    {
        var dbRecipe = new DbRecipe()
        {
            Title = recipe.Title,
            Ingredients = recipe.Ingredients.Select(ing => 
                new DbIngredient(ing.ItemType, ing.Unit, ing.Amount, ing.Label, ing.Note)).ToList(),
            Instructions = recipe.Instructions.Select(ins => 
                new DbInstruction(ins.ItemType, ins.Label)).ToList(),
            
            Category = new DbCategory(Label: recipe.Category),
            Cuisine = new DbCuisine(Label: recipe.Cuisine),
            Servings = recipe.Servings,
            ServingType = new DbServingType(Label: recipe.ServingType),
            
            PreparationTime = new TimeSpan(recipe.PreparationTimeDays ?? 0, recipe.PreparationTimeHours, recipe.PreparationTimeMinutes, 0),
            CookingTime = new TimeSpan(recipe.CookingTimeDays, recipe.CookingTimeHours, recipe.CookingTimeMinutes, 0),
            CustomTime = new TimeSpan(recipe.CustomTimeDays, recipe.CustomTimeHours, recipe.CustomTimeMinutes, 0),
            CustomTimeLabel = new DbCustomTimeLabel(recipe.CustomTimeType),
            
            Energy = recipe.Nutrition.Energy,
            Carbohydrates = recipe.Nutrition.Carbohydrates,
            Protein = recipe.Nutrition.Protein,
            Fat = recipe.Nutrition.Fat,
            Sodium = recipe.Nutrition.Sodium,
            
            Tags = recipe.Tags.Select(t => new DbTag(t)).ToList(),
            Slug = new DbSlug(recipe.Slug)
        };

        return dbRecipe;
    }
}