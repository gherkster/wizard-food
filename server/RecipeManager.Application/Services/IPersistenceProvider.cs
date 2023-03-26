namespace RecipeManager.Application.Services;

public interface IPersistenceProvider
{
    Task SaveFileAsync(byte[] fileBytes, string folderPath, string fileName, string contentType);
    Task DeleteImageAsync(Guid id);
}