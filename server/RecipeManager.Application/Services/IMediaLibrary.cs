using RecipeManager.Application.Models.Core;
using RecipeManager.Application.Models.View;

namespace RecipeManager.Application.Services;

public interface IMediaLibrary
{
    Task<ImageMeta> ConvertAndStoreImageAsync(byte[] imageBytes, string fileName, string originalContentType);
}