namespace API.Configs;

public class DatabaseOptions
{
    public const string Position = nameof(DatabaseOptions);
    public string DatabasePath { get; set; } = string.Empty;
}