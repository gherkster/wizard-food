using System.Net;
using System.Threading.Tasks;
using HttpMultipartParser;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using RecipeManager.Application.Extensions;
using RecipeManager.Application.Services;

namespace RecipeManager.AzureFunctions.Functions;

public class UploadImage
{
    private readonly IMediaLibrary _mediaLibrary;
    
    public UploadImage(IMediaLibrary mediaLibrary)
    {
        _mediaLibrary = mediaLibrary;
    }
    
    [Function("UploadImage")]
    public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req)
    {
        var parsedFormBody = await MultipartFormDataParser.ParseAsync(req.Body);
        var file = parsedFormBody?.Files[0];

        if (file?.Data is null || file?.FileName is null)
        {
            return req.CreateResponse(HttpStatusCode.BadRequest);
        }
        
        var imageBytes = await file.Data.ToByteArrayAsync();

        await _mediaLibrary.ConvertAndStoreImageAsync(imageBytes, file.FileName, file.ContentType);
        
        // TODO: Output binding for media library cosmos db container to store image metadata?

        return req.CreateResponse(HttpStatusCode.OK);
    }
}