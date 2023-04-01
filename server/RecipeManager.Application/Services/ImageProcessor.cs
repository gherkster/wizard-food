using SixLabors.ImageSharp.Formats.Webp;

namespace RecipeManager.Application.Services;

public class ImageProcessor : IImageProcessor
{
    public byte[] ConvertToWebP(byte[] imageBytes, int imageWidth)
    {
        using var image = Image.Load(imageBytes);
        
        image.Mutate(c =>
        {
            c.AutoOrient();
            c.Resize(imageWidth, 0);
        });

        using var memoryStream = new MemoryStream();
        image.Save(memoryStream, new WebpEncoder()
        {
            SkipMetadata = true
        });
        return memoryStream.ToArray();
    }

    public byte[] ConvertToWebPThumbnail(byte[] imageBytes)
    {
        // Generate tiny thumbnail for loading downscaled, blurred image (<1kb)
        using var image = Image.Load(imageBytes);
        
        image.Mutate(c =>
        {
            c.AutoOrient();
            c.Resize(24, 0);
        });

        using var memoryStream = new MemoryStream();
        image.Save(memoryStream, new WebpEncoder()
        {
            //Quality = 25,
            NearLossless = false,
            SkipMetadata = true,
        });
        
        return memoryStream.ToArray();
    }

    public (int Width, int Height) GetImageDimensions(byte[] imageBytes)
    {
        var imageInfo = Image.Identify(imageBytes);
        return (imageInfo.Width, imageInfo.Height);
    }
}
