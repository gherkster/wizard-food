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
            Note = dbRecipe.Note,
            IngredientGroups = dbRecipe.IngredientGroups
                .Select(ig => new IngredientGroup(ig.Name) { Ingredients = ig.Ingredients
                    .Select(i => new Ingredient(i.Amount, i.Unit, i.Name) 
                    {
                        Note = i.Note
                    }).ToList()
                }).ToList(),
            InstructionGroups = dbRecipe.InstructionGroups
                .Select(ig => new InstructionGroup(ig.Name) { Instructions = ig.Instructions
                    .Select(i => new Instruction(i.Label))
                    .ToList()})
                .ToList(),

            Category = dbRecipe.Category.Label,
            Cuisine = dbRecipe.Cuisine.Label,
            Servings = dbRecipe.Servings,
            Rating = dbRecipe.Rating,
            
            PreparationDuration = dbRecipe.PreparationTime != null 
                ? new RecipeDuration("Preparation")
                    {
                        Minutes = dbRecipe.PreparationTime.Value.Minutes,
                        Hours = dbRecipe.PreparationTime.Value.Hours,
                        Days = dbRecipe.PreparationTime.Value.Days
                    }
                : null,
            CookingDuration = dbRecipe.CookingTime != null 
                ? new RecipeDuration("Cooking")
                    {
                        Minutes = dbRecipe.CookingTime.Value.Minutes,
                        Hours = dbRecipe.CookingTime.Value.Hours,
                        Days = dbRecipe.CookingTime.Value.Days
                    }
                : null,
            CustomDurations = dbRecipe.CustomTimes.Select(ct => new RecipeDuration(ct.CustomTimeLabel.Label)
            {
                Minutes = ct.CookingTime.Minutes,
                Hours = ct.CookingTime.Hours,
                Days = ct.CookingTime.Days
            }).ToList(),

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
            Note = recipe.Note,
            IngredientGroups = recipe.IngredientGroups
                .Select(ig => new DbIngredientGroup(ig.Name) 
                {
                    Ingredients = ig.Ingredients
                        .Select(i => new DbIngredient(i.Unit, i.Amount, i.Name, i.Note))
                        .ToList()
                }).ToList(),
            InstructionGroups = recipe.InstructionGroups.Select(ig => new DbInstructionGroup(ig.Name)
            {
                Instructions = ig.Instructions
                    .Select(i => new DbInstruction(i.Label))
                    .ToList()
            }).ToList(),

            Category = new DbCategory(Label: recipe.Category),
            Cuisine = new DbCuisine(Label: recipe.Cuisine),
            Servings = recipe.Servings,
            Rating = recipe.Rating,
            
            PreparationTime = recipe.PreparationDuration != null 
                ? new TimeSpan(recipe.PreparationDuration.Days, recipe.PreparationDuration.Hours, recipe.PreparationDuration.Minutes, 0) 
                : null,
            CookingTime = recipe.CookingDuration != null 
                ? new TimeSpan(recipe.CookingDuration.Days, recipe.CookingDuration.Hours, recipe.CookingDuration.Minutes, 0) 
                : null,
            CustomTimes = recipe.CustomDurations
                .Select(cd => new DbCustomTime(new TimeSpan(cd.Days, cd.Hours, cd.Minutes, 0)) { CustomTimeLabel = new DbCustomTimeLabel(cd.Name)})
                .ToList(),
            
            Tags = recipe.Tags.Select(t => new DbTag(t)).ToList(),
            Slug = recipe.Slug
        };

        return dbRecipe;
    }
}