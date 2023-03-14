namespace API;

public static class Constants
{
    public static readonly TimeSpan SessionTimeout = TimeSpan.FromMinutes(30);
    public static readonly List<int> GeneratedImageWidths = new() { 1200, 900, 720, 480 };
}