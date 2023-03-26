using RecipeManager.Application.Models.Core;

namespace RecipeManager.Application.Services;

public interface IImageProcessor
{
    byte[] ConvertToWebP(byte[] imageBytes, int imageWidth);
    byte[] ConvertToWebPThumbnail(byte[] imageBytes);
    (int Width, int Height) GetImageDimensions(byte[] imageBytes);
}