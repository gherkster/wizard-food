using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace API.Models.Database.Context;

public class DatabaseContext : DbContext
{
    public DbSet<DbRecipe> Recipes => Set<DbRecipe>();
    public DbSet<DbCategory> Categories => Set<DbCategory>();
    public DbSet<DbCuisine> Cuisines => Set<DbCuisine>();
    public DbSet<DbCustomTime> CustomTimes => Set<DbCustomTime>();
    public DbSet<DbCustomTimeLabel> CustomTimeLabels => Set<DbCustomTimeLabel>();
    public DbSet<DbTag> Tags => Set<DbTag>();

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite($"Data Source=Persistence/sqlite.db");
        options.EnableSensitiveDataLogging(); // TODO: Remove for production
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Set database collation to case-insensitive string comparison
        // Override the default string comparison method to include all Unicode characters
        // https://github.com/dotnet/efcore/issues/11414#issuecomment-376272297
        var dbConnection = (SqliteConnection)Database.GetDbConnection();
        dbConnection.CreateCollation("NOCASE", (x, y) => string.Compare(x, y, ignoreCase:true));
        
        // Default string database columns to case-insensitive https://stackoverflow.com/a/70153872
        builder.UseCollation("NOCASE");
        foreach (var property in builder.Model.GetEntityTypes().SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(string)))
        {
            property.SetCollation("NOCASE");
        }
        
        // Set up search indexes
        builder.Entity<DbRecipe>()
            .HasIndex(r => r.Title);
        
        builder.Entity<DbRecipe>()
            .HasIndex(r => r.Slug)
            .IsUnique();

        builder.Entity<DbCategory>()
            .HasIndex(r => r.Label);
        
        builder.Entity<DbCuisine>()
            .HasIndex(r => r.Label);

        builder.Entity<DbTag>()
            .HasIndex(t => t.Label)
            .IsUnique();

        builder.Entity<DbIngredient>()
            .HasIndex(i => i.Name);
    }

    public async Task<DropdownOptions> GetDropdownOptionsAsync()
    {
        var categoriesTask = Categories.AsNoTracking().ToListAsync();
        var cuisinesTask = Cuisines.AsNoTracking().ToListAsync();
        var customTimesLabelsTask = CustomTimeLabels.AsNoTracking().ToListAsync();
        var tagsTask = Tags.AsNoTracking().ToListAsync();

        await Task.WhenAll(categoriesTask, cuisinesTask, customTimesLabelsTask, tagsTask);
        
        var dropdownOptions = new DropdownOptions()
        {
            Categories = categoriesTask.Result.ToList(),
            Cuisines = cuisinesTask.Result.ToList(),
            CustomTimeTypes = customTimesLabelsTask.Result.ToList(),
            Tags = tagsTask.Result.ToList()
        };

        return dropdownOptions;
    }
}