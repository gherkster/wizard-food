using RecipeManager.Application.Models.Core;
using RecipeManager.Application.Models.View;
using RecipeManager.Application.Services;

namespace RecipeManager.WebAPI.Services;

public class MediaLibrary : IMediaLibrary
{
    private readonly IImageProcessor _imageProcessor;
    private readonly IPersistenceProvider _persistenceProvider;
    
    public MediaLibrary(IImageProcessor imageProcessor, IPersistenceProvider persistenceProvider)
    {
        _imageProcessor = imageProcessor;
        _persistenceProvider = persistenceProvider;
    }
    
    public async Task<ImageMeta> ConvertAndStoreImageAsync(byte[] imageBytes, string fileName)
    {
        var imageId = Guid.NewGuid();
        
        // Store the file inside a Guid-named folder alongside the optimized ones
        await _persistenceProvider.SaveFileAsync(imageBytes, imageId.ToString(), $"original{Path.GetExtension(fileName)}");

        foreach (var imageWidth in Constants.GeneratedImageWidths)
        {
            var convertedImage = _imageProcessor.ConvertToWebP(imageBytes, imageWidth);
            await _persistenceProvider.SaveFileAsync(convertedImage, imageId.ToString(), $"{imageWidth}.webp");
        }

        // Generate tiny thumbnail for loading downscaled, blurred image (<500b)
        var thumbnail = _imageProcessor.ConvertToWebPThumbnail(imageBytes);
        await _persistenceProvider.SaveFileAsync(thumbnail, imageId.ToString(), "thumb.webp");

        var imageDimensions = _imageProcessor.GetImageDimensions(imageBytes);
        
        var imageMeta = new ImageMeta()
        {
            Id = imageId,
            DisplayName = Path.GetFileName(fileName),
            // Even though these are based on the original image dimensions, they are named aspect ratio
            // because they will be used for aspect ratio calculations with reduced-size images, where the original
            // image dimension ratio is required, not the actual dimensions
            AspectRatioX = imageDimensions.Width,
            AspectRatioY = imageDimensions.Height
        };

        return imageMeta;
    }

    public void DeleteImage(Guid id) => _persistenceProvider.DeleteImage(id);
}
