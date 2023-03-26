namespace RecipeManager.WebAPI.Extensions;

public static class FileExtensions
{
    public static byte[] ToByteArray(this IFormFile file)
    {
        using var memoryStream = new MemoryStream();
        file.CopyTo(memoryStream);

        return memoryStream.ToArray();
    }
    
    public static async Task<byte[]> ToByteArrayAsync(this IFormFile file)
    {
        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);

        return memoryStream.ToArray();
    }
}