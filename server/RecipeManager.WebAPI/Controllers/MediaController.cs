using RecipeManager.WebAPI.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeManager.Application.Models.View;
using RecipeManager.Application.Services;
using RecipeManager.WebAPI.Context;

namespace RecipeManager.WebAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class MediaController : ControllerBase
{
    private static readonly List<string> AllowedFileExtensions = new() { ".jpg", ".jpeg", ".png", ".webp", ".heic" };

    private readonly IMediaLibrary _mediaLibrary;
    private readonly DatabaseContext _db;
    
    public MediaController(IMediaLibrary mediaLibrary, DatabaseContext dbContext)
    {
        _mediaLibrary = mediaLibrary;
        _db = dbContext;
    }
    
    [HttpPost]
    [Route("Image")]
    public async Task<ActionResult<ImageMeta>> Image(IFormFile file)
    {
        // Since this controller is not public we only need basic file validation
        var fileExtension = Path.GetExtension(file.FileName).ToLower();
        if (!fileExtension.IsIn(AllowedFileExtensions))
        {
            return BadRequest("Invalid file type uploaded");
        }

        var imageMeta = await _mediaLibrary.ConvertAndStoreImageAsync(await file.ToByteArrayAsync(), file.FileName, file.ContentType);

        // Persist the image metadata in the database
        await _db.Images.AddAsync(imageMeta.AsDatabaseModel());
        await _db.SaveChangesAsync();

        return Ok(imageMeta);
    }
}