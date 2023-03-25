using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using RecipeManager.Application.Services;
using RecipeManager.AzureFunctions.Models;

namespace RecipeManager.AzureFunctions.Services;

public class D2PersistenceProvider : IPersistenceProvider
{
    // Cloudflare recommends using the amazon S3 client since their D2 storage is S3-compatible
    private readonly AmazonS3Client _cloudflareClient;
    private readonly AppSettings _settings;

    public D2PersistenceProvider(AmazonS3Client cloudflareClient, IOptions<AppSettings> settings)
    {
        _cloudflareClient = cloudflareClient;
        _settings = settings.Value;
    }
    
    public async Task SaveFileAsync(byte[] fileBytes, string folderPath, string fileName, string contentType)
    {
        using var memoryStream = new MemoryStream(fileBytes);
        var request = new PutObjectRequest()
        {
            InputStream = memoryStream,
            ContentType = contentType,
            Key = $"{folderPath}/{fileName}" ,
            BucketName = _settings.CloudflareR2BucketName,
            DisablePayloadSigning = true,
        };

        await _cloudflareClient.PutObjectAsync(request);
    }

    public async Task DeleteImageAsync(Guid id)
    {
        // Get all items in the Guid "folder".
        // S3/D2 does not have a concept of folders so it's just the prefix of the filename with a forward slash separator
        var listObjectsRequest = new ListObjectsRequest()
        {
            Prefix = id.ToString()
        };

        var existingObjects = await _cloudflareClient.ListObjectsAsync(listObjectsRequest);
        if (existingObjects is null)
        {
            return;
        }

        var deleteMatchingObjectsRequest = new DeleteObjectsRequest()
        {
            Objects = existingObjects.S3Objects.Select(s3O => new KeyVersion()
            {
                Key = s3O.Key
            }).ToList()
        };

        await _cloudflareClient.DeleteObjectsAsync(deleteMatchingObjectsRequest);
    }
}
