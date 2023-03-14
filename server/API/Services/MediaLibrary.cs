using API.Models.View;
using ImageMagick;

namespace API.Services;

public class MediaLibrary : IMediaLibrary
{
    private readonly IImageProcessor _imageProcessor;
    private readonly string _mediaLibraryDirectory;
    
    public MediaLibrary(IImageProcessor imageProcessor, IHostEnvironment env)
    {
        _imageProcessor = imageProcessor;
        // .../wwwroot/images
        _mediaLibraryDirectory = Path.Join(env.ContentRootPath, "media", "images");
    }
    
    public async Task<ImageMeta> ConvertAndStoreImageAsync(IFormFile file)
    {
        var imageId = Guid.NewGuid();
        
        // TODO: Try catch for permissions issues with creating folders, catch should clean up created folders (except media library)

        var imageDirectory = Path.Join(_mediaLibraryDirectory, imageId.ToString());
        if (!Directory.Exists(imageDirectory))
        {
            Directory.CreateDirectory(imageDirectory);
        }

        // TODO: Create all output resolutions in parallel since work is CPU bound? Needs testing

        // Store the original file alongside the optimized ones
        await using (var fileStream = new FileStream(Path.Join(imageDirectory, $"original{Path.GetExtension(file.FileName)}"), FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        foreach (var imageWidth in Constants.GeneratedImageWidths)
        {
            var convertedImage = _imageProcessor.ConvertToWebP(file, imageWidth);
            await File.WriteAllBytesAsync(Path.Join(imageDirectory, $"{imageWidth}.webp"), convertedImage);
        }

        // Generate tiny thumbnail for loading downscaled, blurred image (<500b)
        var thumbnail = _imageProcessor.ConvertToWebPThumbnail(file);
        await File.WriteAllBytesAsync(Path.Join(imageDirectory, "thumb.webp"), thumbnail);

        var imageDimensions = _imageProcessor.GetImageDimensions(file);
        
        var imageMeta = new ImageMeta()
        {
            Id = imageId,
            DisplayName = Path.GetFileName(file.FileName),
            // Even though these are based on the original image dimensions, they are named aspect ratio
            // because they will be used for aspect ratio calculations with reduced-size images, where the original
            // image dimension ratio is required, not the actual dimensions
            AspectRatioX = imageDimensions.Width,
            AspectRatioY = imageDimensions.Height
        };

        return imageMeta;
    }

    public void DeleteImage(Guid id)
    {
        var imageDirectory = Path.Join(_mediaLibraryDirectory, id.ToString());

        if (Directory.Exists(imageDirectory))
        {
            // Delete image directory containing original and optimized images
            Directory.Delete(imageDirectory, recursive: true);
        }
    }
}

public interface IMediaLibrary
{
    Task<ImageMeta> ConvertAndStoreImageAsync(IFormFile file);
    void DeleteImage(Guid id);
}