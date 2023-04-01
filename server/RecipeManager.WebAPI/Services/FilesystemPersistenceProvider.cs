using RecipeManager.Application.Services;

namespace RecipeManager.WebAPI.Services;

public class FilesystemPersistenceProvider : IPersistenceProvider
{
    private readonly string _mediaLibraryDirectory;
    
    public FilesystemPersistenceProvider(IHostEnvironment env)
    {
        // .../media/images
        _mediaLibraryDirectory = Path.Join(env.ContentRootPath, "media", "images");
    }
    
    public async Task SaveFileAsync(byte[] fileBytes, string folderPath, string fileName, string contentType)
    {
        // TODO: Try catch for permissions issues with creating folders, catch should clean up created folder

        var imageDirectory = Path.Join(_mediaLibraryDirectory, folderPath);
        Directory.CreateDirectory(imageDirectory);
        
        await File.WriteAllBytesAsync(Path.Join(imageDirectory, fileName), fileBytes);
    }

    public Task DeleteImageAsync(Guid id)
    {
        var imageDirectory = Path.Join(_mediaLibraryDirectory, id.ToString());

        if (Directory.Exists(imageDirectory))
        {
            // Delete image directory containing original and optimized images
            Directory.Delete(imageDirectory, recursive: true);
        }

        return Task.CompletedTask;
    }
}