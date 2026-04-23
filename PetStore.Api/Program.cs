var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var products = new List<Product>
{
    new(1, "Dog Food", 9.99m),
    new(2, "Cat Toy", 4.99m),
    new(3, "Bird Seed", 3.49m)
};

app.MapGet("/products", () => Results.Ok(products))
   .WithName("GetProducts")
   .WithOpenApi();

app.Run();

record Product(int Id, string Name, decimal Price);