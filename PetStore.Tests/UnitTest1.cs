namespace PetStore.Tests;

public class UnitTest1
{
    [Fact]
public async Task GetProducts_ReturnsOk()
{
    // Use WebApplicationFactory (or manually test the endpoint)
    // For simplicity, just an integration test using HttpClient
    await using var application = new PetStoreApplication();
    var client = application.CreateClient();
    var response = await client.GetAsync("/products");
    response.EnsureSuccessStatusCode();
    var content = await response.Content.ReadAsStringAsync();
    Assert.Contains("Dog Food", content);
}
}
