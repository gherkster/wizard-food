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
            Description = dbRecipe.Description,
            Ingredients = dbRecipe.Ingredients.Select(ing => 
                new Ingredient(ing.ItemType, ing.Label) { Amount = ing.Amount, Unit = ing.Unit, Note = ing.Note }).ToList(),
            Instructions = dbRecipe.Instructions.Select(ins => 
                new Instruction(ins.ItemType, ins.Label)).ToList(),
            
            Category = dbRecipe.Category.Label,
            Cuisine = dbRecipe.Cuisine.Label,
            Servings = dbRecipe.Servings,
            ServingType = dbRecipe.ServingType.Label,
            Rating = dbRecipe.Rating,
            
            PreparationTime = new RecipeDuration()
            {
                Minutes = dbRecipe.PreparationTime.Minutes,
                Hours = dbRecipe.PreparationTime.Hours,
                Days = dbRecipe.PreparationTime.Days
            },
            CookingTime = new RecipeDuration()
            {
                Minutes = dbRecipe.CookingTime.Minutes,
                Hours = dbRecipe.CookingTime.Hours,
                Days = dbRecipe.CookingTime.Days
            },
            CustomTime = new RecipeDuration()
            {
                Minutes = dbRecipe.CustomTime.Minutes,
                Hours = dbRecipe.CustomTime.Hours,
                Days = dbRecipe.CustomTime.Days
            },
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
            Slug = dbRecipe.Slug
        };

        return recipe;
    }

    public static DbRecipe AsDatabaseModel(this Recipe recipe)
    {
        var dbRecipe = new DbRecipe()
        {
            Title = recipe.Title,
            Description = recipe.Description,
            Ingredients = recipe.Ingredients.Select(ing => 
                new DbIngredient(ing.ItemType, ing.Unit, ing.Amount, ing.Label, ing.Note)).ToList(),
            Instructions = recipe.Instructions.Select(ins => 
                new DbInstruction(ins.ItemType, ins.Label)).ToList(),
            
            Category = new DbCategory(Label: recipe.Category),
            Cuisine = new DbCuisine(Label: recipe.Cuisine),
            Servings = recipe.Servings,
            ServingType = new DbServingType(Label: recipe.ServingType),
            Rating = recipe.Rating,
            
            PreparationTime = new TimeSpan(recipe.PreparationTime.Days, recipe.PreparationTime.Hours, recipe.PreparationTime.Minutes, 0),
            CookingTime = new TimeSpan(recipe.CookingTime.Days, recipe.CookingTime.Hours, recipe.CookingTime.Minutes, 0),
            CustomTime = new TimeSpan(recipe.CustomTime.Days, recipe.CustomTime.Hours, recipe.CustomTime.Minutes, 0),
            CustomTimeLabel = new DbCustomTimeLabel(recipe.CustomTimeType),
            
            Energy = recipe.Nutrition.Energy,
            Carbohydrates = recipe.Nutrition.Carbohydrates,
            Protein = recipe.Nutrition.Protein,
            Fat = recipe.Nutrition.Fat,
            Sodium = recipe.Nutrition.Sodium,
            
            Tags = recipe.Tags.Select(t => new DbTag(t)).ToList(),
            Slug = recipe.Slug
        };

        return dbRecipe;
    }
}