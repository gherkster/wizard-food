using System.ComponentModel.DataAnnotations;

namespace API.Models.Database;

public record DbImage(string FileName, byte[] BinaryData)
{
    [Key]
    public int Id { get; private set; }
    public string FileName { get; set; } = FileName;
    public byte[] BinaryData { get; set; } = BinaryData;
}