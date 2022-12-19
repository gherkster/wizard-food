using System.Text.Json.Serialization;
using API.Converters;
using API.Extensions;
using API.Models.Database.Context;
using Microsoft.AspNetCore.SpaServices;
using VueCliMiddleware;

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

builder.Services.AddSpaStaticFiles(opt => opt.RootPath = "../frontend/dist");

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

app.UseSpaStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseAuthenticationHeader();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();

    if (app.Environment.IsDevelopment())
    {
        endpoints.MapToVueCliProxy(
            pattern: "{*path}",
            options: new SpaOptions()
            {
                SourcePath = "../frontend", 
                StartupTimeout = TimeSpan.FromSeconds(60)
            },
            npmScript: app.Environment.IsDevelopment() ? "dev" : null,
            regex: "ready in .+ ms",
            port: 8080,
            forceKill: true,
            wsl: false);
    }
});

app.Run();