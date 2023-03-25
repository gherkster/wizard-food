using ImageMagick;

namespace RecipeManager.Application.Services;

public class ImageProcessor : IImageProcessor
{
    public byte[] ConvertToWebP(byte[] imageBytes, int imageWidth)
    {
        using var image = new MagickImage(imageBytes);
            
        image.Format = MagickFormat.WebP;
        StripExifProfile(image);
        
        // Ensure AutoOrient is called before Resize, so that resizing is performed on the rotated image
        image.AutoOrient();
        image.Resize(imageWidth, 0);

        return image.ToByteArray();
    }

    public byte[] ConvertToWebPThumbnail(byte[] imageBytes)
    {
        // Generate tiny thumbnail for loading downscaled, blurred image (<1kb)
        using var image = new MagickImage(imageBytes);
        
        image.Format = MagickFormat.WebP;
        StripExifProfile(image);

        // Ensure AutoOrient is called before Resize, so that resizing is performed on the rotated image
        image.AutoOrient();
        image.Thumbnail(width: 24, 0);

        return image.ToByteArray();
    }

    public (int Width, int Height) GetImageDimensions(byte[] imageBytes)
    {
        using var image = new MagickImage(imageBytes);
        
        image.AutoOrient();

        return (image.Width, image.Height);
    }

    private static void StripExifProfile(MagickImage image)
    {
        // Strip out EXIF data
        var thumbExif = image.GetExifProfile();
        if (thumbExif != null)
        {
            image.RemoveProfile(thumbExif);
        }
    }
}
