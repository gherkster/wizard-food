using Microsoft.EntityFrameworkCore;

namespace API.Models.Database.Context;

public class DatabaseContext : DbContext
{
    public DbSet<DbRecipe> Recipes => Set<DbRecipe>();
    public DbSet<DbCategory> Categories => Set<DbCategory>();
    public DbSet<DbCuisine> Cuisines => Set<DbCuisine>();
    public DbSet<DbCustomTimeLabel> CustomTimeTypes => Set<DbCustomTimeLabel>();
    public DbSet<DbServingType> ServingTypes => Set<DbServingType>();
    public DbSet<DbTag> Tags => Set<DbTag>();
    public DbSet<DbSlug> Slugs => Set<DbSlug>();

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite($"Data Source=Persistence/sqlite.db");
        options.EnableSensitiveDataLogging(); // TODO: Remove for production
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    }

    public async Task<DropdownOptions> GetDropdownOptionsAsync()
    {
        var categoriesTask = Categories.ToListAsync();
        var cuisinesTask = Cuisines.ToListAsync();
        var customTimeTypesTask = CustomTimeTypes.ToListAsync();
        var servingTypesTask = ServingTypes.ToListAsync();
        var tagsTask = Tags.ToListAsync();

        await Task.WhenAll(categoriesTask, cuisinesTask, customTimeTypesTask, servingTypesTask, tagsTask);
        
        var dropdownOptions = new DropdownOptions()
        {
            Categories = categoriesTask.Result.ToList(),
            Cuisines = cuisinesTask.Result.ToList(),
            CustomTimeTypes = customTimeTypesTask.Result.ToList(),
            ServingTypes = servingTypesTask.Result.ToList(),
            Tags = tagsTask.Result.ToList()
        };

        return dropdownOptions;
    }
}