using System;

namespace RecipeManager.AzureFunctions.Models;

public class DbImageMeta
{
    public Guid Id { get; init; }
    public string DisplayName { get; set; } = string.Empty;
    public int AspectRatioX { get; set; } = 1;
    public int AspectRatioY { get; set; } = 1;
}