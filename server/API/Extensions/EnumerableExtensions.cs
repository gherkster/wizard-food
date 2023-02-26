namespace API.Extensions;

public static class EnumerableExtensions
{
    /// <summary>
    /// A more intuitive method of checking whether an item exists within a collection.
    /// </summary>
    /// <remarks>
    /// A wrapper for <see cref="Enumerable.Contains{TSource}(System.Collections.Generic.IEnumerable{TSource},TSource)"/>
    /// </remarks>
    public static bool IsIn<T>(this T item, IEnumerable<T> collection)
    {
        return collection.Contains(item);
    }

    /// <summary>
    /// A more intuitive method of checking whether an item exists within a collection.
    /// </summary>
    /// <remarks>
    /// A wrapper for <see cref="Enumerable.Contains{TSource}(System.Collections.Generic.IEnumerable{TSource},TSource)"/>
    /// </remarks>
    public static bool IsIn<T>(this T item, params T[] args)
    {
        return args.Contains(item);
    }
}