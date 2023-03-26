using System.Linq;
using RecipeManager.Application.Models.View;
using RecipeManager.AzureFunctions.Models;

namespace RecipeManager.AzureFunctions.Extensions;

public static class MappingExtensions
{
    public static DbRecipe ToDatabaseModel(this Recipe recipe)
    {
        var dbRecipe = new DbRecipe()
        {
            Id = recipe.Id,
            Title = recipe.Title,
            CoverImage = recipe.CoverImage != null
                ? new DbImageMeta()
                {
                    Id = recipe.CoverImage.Id,
                    DisplayName = recipe.CoverImage.DisplayName,
                    AspectRatioX = recipe.CoverImage.AspectRatioX,
                    AspectRatioY = recipe.CoverImage.AspectRatioY
                }
                : null,
            Note = recipe.Note,
            IngredientGroups = recipe.IngredientGroups.Select(ig => ig.ToDatabaseModel()).ToList(),
            InstructionGroups = recipe.InstructionGroups.Select(ig => ig.ToDatabaseModel()).ToList(),
        };

        return dbRecipe;
    }

    private static DbIngredientGroup ToDatabaseModel(this IngredientGroup ingredientGroup)
    {
        var dbIngredientGroup = new DbIngredientGroup()
        {
            Name = ingredientGroup.Name,
            Ingredients = ingredientGroup.Ingredients.Select(i => new DbIngredient(i.Name)
            {
                Amount = i.Amount,
                Unit = i.Unit,
                Note = i.Note
            }).ToList()
        };

        return dbIngredientGroup;
    }

    private static DbInstructionGroup ToDatabaseModel(this InstructionGroup instructionGroup)
    {
        var dbInstructionGroup = new DbInstructionGroup()
        {
            Name = instructionGroup.Name,
            Instructions = instructionGroup.Instructions.Select(i => i.Label).ToList()
        };

        return dbInstructionGroup;
    }
}