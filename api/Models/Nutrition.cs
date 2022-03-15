namespace API.Models;

public class Nutrition
{
    public decimal Energy { get; set; } = decimal.Zero;
    public decimal Protein { get; set; } = decimal.Zero;
    public decimal Carbohydrates { get; set; } = decimal.Zero;
    public decimal Fat { get; set; } = decimal.Zero;
    public decimal Sodium { get; set; } = decimal.Zero;
}