using System.Text.Json;
using System.Text.Json.Serialization;

namespace API.Converters;

/// <summary>
/// JSON Converter class to automatically trim all incoming string values.<br/><br/>
/// 
/// This allows a user to enter strings on the frontend with trailing spaces without triggering excessive validation,
/// however also ensures the data is stored in a consistent fashion.
/// </summary>
public class JsonStringTrimConverter : JsonConverter<string?>
{
    public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return reader.GetString()?.Trim();
    }

    public override void Write(Utf8JsonWriter writer, string? value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value);
    }
}