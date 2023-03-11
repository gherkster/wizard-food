namespace API.Models.Core;

public readonly record struct Fraction(int Numerator, int Denominator)
{
    public static Fraction Parse(string fraction)
    {
        if (!fraction.Contains("/"))
        {
            throw new ArgumentException("Fraction must contain a / character");
        }

        var values = fraction.Split("/");
        if (values.Length != 2)
        {
            throw new ArgumentException("Fraction must contain integers on either side of the / character");
        }

        if (!int.TryParse(values[0], out var numerator) || !int.TryParse(values[1], out var denominator))
        {
            throw new ArgumentException("Numerator and denominator must be integers");
        }

        return new Fraction()
        {
            Numerator = numerator,
            Denominator = denominator
        };
    }

    public override string ToString()
    {
        return $"{Numerator}/{Denominator}";
    }
}