using RecipeManager.WebAPI.Models.Database;
using RecipeManager.WebAPI.Models.View;

namespace RecipeManager.WebAPI.Extensions;

public static class MappingExtensions
{
    public static Recipe AsViewModel(this DbRecipe dbRecipe)
    {
        var recipe = new Recipe()
        {
            Id = dbRecipe.Id,
            Title = dbRecipe.Title,
            CoverImage = dbRecipe.CoverImage?.AsViewModel(),
            Note = dbRecipe.Note,
            IngredientGroups = dbRecipe.IngredientGroups
                .Select(ig => new IngredientGroup() { Name = ig.Name, Ingredients = ig.Ingredients
                    .Select(i => new Ingredient(i.Name)
                    {
                        Amount = i.Amount,
                        Unit = i.Unit,
                        Note = i.Note
                    }).ToList()
                }).ToList(),
            InstructionGroups = dbRecipe.InstructionGroups
                .Select(ig => new InstructionGroup() { Name = ig.Name, Instructions = ig.Instructions
                    .Select(i => new Instruction(i.Label))
                    .ToList()})
                .ToList(),

            Category = dbRecipe.Category.Label,
            Cuisine = dbRecipe.Cuisine.Label,
            Servings = dbRecipe.Servings,
            Rating = dbRecipe.Rating,
            
            PreparationDuration = new RecipeDuration("Preparation")
            {
                Minutes = dbRecipe.PreparationTime.Minutes,
                Hours = dbRecipe.PreparationTime.Hours,
                Days = dbRecipe.PreparationTime.Days
            },
            CookingDuration = new RecipeDuration("Cooking")
            {
                Minutes = dbRecipe.CookingTime.Minutes,
                Hours = dbRecipe.CookingTime.Hours,
                Days = dbRecipe.CookingTime.Days
            },
            CustomDurations = dbRecipe.CustomTimes.Select(ct => new RecipeDuration(ct.CustomTimeLabel.Label)
            {
                Minutes = ct.CookingTime.Minutes,
                Hours = ct.CookingTime.Hours,
                Days = ct.CookingTime.Days
            }).ToList(),

            Tags = dbRecipe.Tags.Select(t => t.Label).OrderBy(t => t).ToList(),
            Slug = dbRecipe.Slug
        };

        return recipe;
    }

    public static DbRecipe AsDatabaseModel(this Recipe recipe, int id = 0)
    {
        var dbRecipe = new DbRecipe()
        {
            Id = id,
            Title = recipe.Title,
            CoverImage = recipe.CoverImage?.AsDatabaseModel(),
            Note = recipe.Note,
            IngredientGroups = recipe.IngredientGroups
                .Select(ig => new DbIngredientGroup() 
                {
                    Name = ig.Name,
                    Ingredients = ig.Ingredients
                        .Select(i => new DbIngredient(i.Name)
                        {
                            Amount = i.Amount,
                            Unit = i.Unit,
                            Note = i.Note
                        })
                        .ToList()
                }).ToList(),
            InstructionGroups = recipe.InstructionGroups.Select(ig => new DbInstructionGroup()
            {
                Name = ig.Name,
                Instructions = ig.Instructions
                    .Select(i => new DbInstruction(i.Label))
                    .ToList()
            }).ToList(),

            Category = new DbCategory(Label: recipe.Category),
            Cuisine = new DbCuisine(Label: recipe.Cuisine),
            Servings = recipe.Servings,
            Rating = recipe.Rating,
            
            PreparationTime = new TimeSpan(recipe.PreparationDuration.Days, recipe.PreparationDuration.Hours, recipe.PreparationDuration.Minutes, 0),
            CookingTime = new TimeSpan(recipe.CookingDuration.Days, recipe.CookingDuration.Hours, recipe.CookingDuration.Minutes, 0),
            CustomTimes = recipe.CustomDurations
                .Select(cd => new DbCustomTime(new TimeSpan(cd.Days, cd.Hours, cd.Minutes, 0)) { CustomTimeLabel = new DbCustomTimeLabel(cd.Name)})
                .ToList(),
            
            Tags = recipe.Tags.Select(t => new DbTag(t)).ToList(),
            Slug = recipe.Slug
        };

        return dbRecipe;
    }

    public static DropdownOptions AsViewModel(this DbDropdownOptions dbOptions)
    {
        var dropdownOptions = new DropdownOptions()
        {
            Categories = dbOptions.Categories.Select(c => c.Label).ToList(),
            Cuisines = dbOptions.Cuisines.Select(c => c.Label).ToList(),
            Tags = dbOptions.Tags.Select(t => t.Label).ToList(),
            CustomTimeTypes = dbOptions.CustomTimeTypes.Select(ctt => ctt.Label).ToList(),
            Units = dbOptions.Units
        };

        return dropdownOptions;
    }

    public static ImageMeta AsViewModel(this DbImageMeta dbImageMeta)
    {
        var imageMeta = new ImageMeta()
        {
            Id = dbImageMeta.Id,
            DisplayName = dbImageMeta.DisplayName,
            AspectRatioX = dbImageMeta.AspectRatioX,
            AspectRatioY = dbImageMeta.AspectRatioY
        };
        
        return imageMeta;
    }

    public static DbImageMeta AsDatabaseModel(this ImageMeta imageMeta)
    {
        var dbImageMeta = new DbImageMeta()
        {
            Id = imageMeta.Id,
            DisplayName = imageMeta.DisplayName,
            AspectRatioX = imageMeta.AspectRatioX,
            AspectRatioY = imageMeta.AspectRatioY
        };

        return dbImageMeta;
    }
}