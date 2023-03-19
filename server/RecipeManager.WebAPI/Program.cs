using System.Text.Json.Serialization;
using RecipeManager.WebAPI.Converters;
using RecipeManager.WebAPI.Extensions;
using RecipeManager.WebAPI.Models.Database.Context;
using RecipeManager.WebAPI.Services;
using CompressedStaticFiles;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DatabaseContext>();

builder.Services
    .AddControllers()
    .AddJsonOptions(
        opt =>
        {
            opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            opt.JsonSerializerOptions.Converters.Add(new JsonStringTrimConverter());
        });

builder.Services.ConfigureAuthentication();
builder.Services.AddSingleton<IMediaLibrary, MediaLibrary>();
builder.Services.AddSingleton<IImageProcessor, ImageProcessor>();

builder.Services.AddCompressedStaticFiles();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseReDoc();
}

// Rewrite /index.html to /
app.UseDefaultFiles();

app.UseCompressedStaticFiles(new StaticFileOptions());
app.ServeMediaLibrary();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseAuthenticationHeader();

// app.UseOptimizedImages(); TODO: Remove?

// Since we don't want the above behaviour for RecipeManager.WebAPI routes, we don't map a fallback and only map controller endpoints here
app.MapWhen(ctx => ctx.Request.Path.StartsWithSegments("/api"), api =>
{
    api.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseSpa(spa =>
    {
        spa.UseProxyToSpaDevelopmentServer($"http://localhost:3000");
    });
}
else
{
    // Map client browser requests to fallback to index.html so that a manual refresh does not trigger a 404
    app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), client =>
    {
        client.UseEndpoints(endpoints =>
        {
            endpoints.MapFallbackToFile("index.html");
        });
    });
}

app.Run();