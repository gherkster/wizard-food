namespace RecipeManager.Application.Extensions;

public static class StreamExtensions
{
    public static byte[] ToByteArray(this Stream input)
    {
        using var memoryStream = new MemoryStream();
        input.CopyTo(memoryStream);
        
        return memoryStream.ToArray();
    }
    
    public static async Task<byte[]> ToByteArrayAsync(this Stream input)
    {
        using var memoryStream = new MemoryStream();
        await input.CopyToAsync(memoryStream);
        
        return memoryStream.ToArray();
    }
}