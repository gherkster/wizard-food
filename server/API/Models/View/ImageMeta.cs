namespace API.Models.View;

public class ImageMeta
{
    public Guid Id { get; init; }
    public string DisplayName { get; set; } = string.Empty;
    public int AspectRatioX { get; set; } = 1;
    public int AspectRatioY { get; set; } = 1;
}