using Microsoft.Extensions.FileProviders;

namespace API.Extensions;

public static class MediaExtensions
{
    public static IApplicationBuilder ServeMediaLibrary(this WebApplication app)
    {
        var mediaLibraryPath = Path.Join(app.Environment.ContentRootPath, "media");
        if (!Directory.Exists(mediaLibraryPath))
        {
            Directory.CreateDirectory(mediaLibraryPath);
        }
        
        app.UseStaticFiles(new StaticFileOptions()
        {
            FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "media")),
            RequestPath = new PathString("/media")
        });

        return app;
    }
}