using System.Collections.Generic;

namespace backend.Models
{
    public static class FrameworkDataStore
    {
        static FrameworkDataStore()
        {
            Database = new List<Framework>();
        }

        public static List<Framework> Database { get; }

    }
}
