using API.Models.Core;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace API.Models.Database.Context;

public class DatabaseContext : IdentityDbContext
{
    private readonly SqliteConnection _dbConnection;
    
    public DatabaseContext()
    {
        // Set database collation to case-insensitive string comparison
        // Override the default string comparison method to include all Unicode characters
        // https://github.com/dotnet/efcore/issues/11414#issuecomment-376272297
        _dbConnection = new SqliteConnection($"Data Source=Persistence/sqlite.db");
        _dbConnection.CreateCollation("NOCASE", (x, y) => string.Compare(x, y, ignoreCase:true));
    }
    
    public DbSet<DbRecipe> Recipes => Set<DbRecipe>();
    public DbSet<DbCategory> Categories => Set<DbCategory>();
    public DbSet<DbCuisine> Cuisines => Set<DbCuisine>();
    public DbSet<DbCustomTime> CustomTimes => Set<DbCustomTime>();
    public DbSet<DbCustomTimeLabel> CustomTimeLabels => Set<DbCustomTimeLabel>();
    public DbSet<DbTag> Tags => Set<DbTag>();
    public DbSet<DbIngredient> Ingredients => Set<DbIngredient>();
    public DbSet<DbImageMeta> Images => Set<DbImageMeta>();

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite(_dbConnection);
        
        #if DEBUG
        options.EnableSensitiveDataLogging();
        options.LogTo(Console.WriteLine);
        #endif
        
        base.OnConfiguring(options);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
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
            .HasIndex(r => r.Label)
            .IsUnique();

        builder.Entity<DbCuisine>()
            .HasIndex(r => r.Label)
            .IsUnique();

        builder.Entity<DbCustomTimeLabel>()
            .HasIndex(tl => tl.Label)
            .IsUnique();

        builder.Entity<DbTag>()
            .HasIndex(t => t.Label)
            .IsUnique();

        builder.Entity<DbIngredient>()
            .HasIndex(i => i.Name);

        builder.Entity<DbIngredient>()
            .Property(i => i.Amount)
            .HasConversion(
                // Null values are never passed to entity converters https://github.com/dotnet/efcore/issues/13850
                a => a.ToString(),
                a => Fraction.Parse(a!));
        
        base.OnModelCreating(builder);
    }

    public async Task<DbDropdownOptions> GetDropdownOptionsAsync()
    {
        // We don't disable change tracking on these queries since this is also used for verifying
        // whether entities already exist during insert/update/delete scenarios
        var categoriesTask = Categories.ToListAsync();
        var cuisinesTask = Cuisines.ToListAsync();
        var customTimesLabelsTask = CustomTimeLabels.ToListAsync();
        var tagsTask = Tags.ToListAsync();

        await Task.WhenAll(categoriesTask, cuisinesTask, customTimesLabelsTask, tagsTask);

        var units = Ingredients
            .Select(i => i.Unit)
            .Distinct();
        
        var dropdownOptions = new DbDropdownOptions()
        {
            Categories = categoriesTask.Result.ToList(),
            Cuisines = cuisinesTask.Result.ToList(),
            CustomTimeTypes = customTimesLabelsTask.Result.ToList(),
            Tags = tagsTask.Result.ToList(),
            Units = units.ToList()
        };

        return dropdownOptions;
    }
}