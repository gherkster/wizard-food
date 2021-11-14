using API.Configs;
using API.Repositories;
using API.Repositories.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SpaServices;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using VueCliMiddleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<ILiteDbRepository, LiteDbRepository>();
builder.Services.Configure<DatabaseOptions>(builder.Configuration.GetSection(DatabaseOptions.Position));

builder.Services.AddControllers();
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

app.UseHttpsRedirection();

app.UseSpaStaticFiles();

app.UseRouting();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();

    endpoints.MapToVueCliProxy(
        pattern: "{*path}",
        options: new SpaOptions() { SourcePath = "../frontend" },
        npmScript: System.Diagnostics.Debugger.IsAttached ? "serve" : null,
        regex: "Compiled successfully",
        forceKill: true,
        wsl: false);
});

app.Run();