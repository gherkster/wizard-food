using NUnit.Framework;

namespace RecipeManager.Tests.PerformanceTests;

public class ImageTests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void Test()
    {
        // TODO: Test performance with benchmark .net on single threaded vs parallel image processing https://codereview.stackexchange.com/a/244372
        Assert.Pass();
    }
}