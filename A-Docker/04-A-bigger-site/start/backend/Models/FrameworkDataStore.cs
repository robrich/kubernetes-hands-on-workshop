namespace Backend.Models;

public static class FrameworkDataStore
{

    static FrameworkDataStore()
    {
        Database = new List<Framework>();
    }

    public static List<Framework> Database { get; }

}
