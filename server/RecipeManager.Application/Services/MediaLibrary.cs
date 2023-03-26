using RecipeManager.Application.Models.View;

namespace RecipeManager.Application.Services;

public class MediaLibrary : IMediaLibrary
{
    private readonly IImageProcessor _imageProcessor;
    private readonly IPersistenceProvider _persistenceProvider;
    
    private static readonly List<int> GeneratedImageWidths = new() { 1200, 900, 720, 480 };
    private const string WebPContentType = "image/webp";

    public MediaLibrary(IImageProcessor imageProcessor, IPersistenceProvider persistenceProvider)
    {
        _imageProcessor = imageProcessor;
        _persistenceProvider = persistenceProvider;
    }
    
    public async Task<ImageMeta> ConvertAndStoreImageAsync(byte[] imageBytes, string fileName, string originalContentType)
    {
        var imageId = Guid.NewGuid();
        
        // Store the file inside a Guid-named folder alongside the optimized ones
        await _persistenceProvider.SaveFileAsync(imageBytes, imageId.ToString(), $"original{Path.GetExtension(fileName)}", originalContentType);

        foreach (var imageWidth in GeneratedImageWidths)
        {
            var convertedImage = _imageProcessor.ConvertToWebP(imageBytes, imageWidth);
            await _persistenceProvider.SaveFileAsync(convertedImage, imageId.ToString(), $"{imageWidth}.webp", WebPContentType);
        }

        // Generate tiny thumbnail for loading downscaled, blurred image (<500b)
        var thumbnail = _imageProcessor.ConvertToWebPThumbnail(imageBytes);
        await _persistenceProvider.SaveFileAsync(thumbnail, imageId.ToString(), "thumb.webp", WebPContentType);

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

    public async Task DeleteImage(Guid id) => await _persistenceProvider.DeleteImageAsync(id);
}
