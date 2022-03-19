namespace API.Models.View;

public class CustomTime
{
    public CustomTime(string customTimeLabel, int customTimeDays, int customTimeHours, int customTimeMinutes)
    {
        CustomTimeLabel = customTimeLabel;
        CustomTimeDays = customTimeDays;
        CustomTimeHours = customTimeHours;
        CustomTimeMinutes = customTimeMinutes;
    }

    public string CustomTimeLabel { get; set; }
    public int CustomTimeDays { get; set; }
    public int CustomTimeHours { get; set; }
    public int CustomTimeMinutes { get; set; }
}