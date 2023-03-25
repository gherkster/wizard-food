using ImageMagick;
using RecipeManager.Application.Services;

namespace RecipeManager.WebAPI.Services;

public class ImageProcessor : IImageProcessor
{
    public byte[] ConvertToWebP(Stream fileStream, int imageWidth)
    {
        using var image = new MagickImage(fileStream);
            
        image.Format = MagickFormat.WebP;
        StripExifProfile(image);
        
        // Ensure AutoOrient is called before Resize, so that resizing is performed on the rotated image
        image.AutoOrient();
        image.Resize(imageWidth, 0);

        return image.ToByteArray();
    }

    public byte[] ConvertToWebPThumbnail(Stream fileStream)
    {
        // Generate tiny thumbnail for loading downscaled, blurred image (<1kb)
        using var image = new MagickImage(fileStream);
        
        image.Format = MagickFormat.WebP;
        StripExifProfile(image);

        // Ensure AutoOrient is called before Resize, so that resizing is performed on the rotated image
        image.AutoOrient();
        image.Thumbnail(width: 24, 0);

        return image.ToByteArray();
    }

    public (int Width, int Height) GetImageDimensions(Stream fileStream)
    {
        using var image = new MagickImage(fileStream);
        
        image.AutoOrient();

        return (image.Width, image.Height);
    }

    private void StripExifProfile(MagickImage image)
    {
        // Strip out EXIF data
        var thumbExif = image.GetExifProfile();
        if (thumbExif != null)
        {
            image.RemoveProfile(thumbExif);
        }
    }
}