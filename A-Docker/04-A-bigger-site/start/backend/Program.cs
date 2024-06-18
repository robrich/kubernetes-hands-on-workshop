using Backend.Models;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the IoC container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// return content so we know the server is running
app.MapGet("/", () => "Backend is running!");

// get all frameworks
app.MapGet("/framework", () => FrameworkDataStore.Database);
// get framework by id
app.MapGet("/framework/{id}", (int id) =>
{
    Framework? framework = FrameworkDataStore.Database.FirstOrDefault(f => f.Id == id);
    return framework switch
    {
        null => Results.NotFound(),
        _ => Results.Ok(framework)
    };
});
// new framework
app.MapPost("/framework", ([FromBody] Framework model) => {
    model.Votes = 0;

    int id = (int?)(
        from d in FrameworkDataStore.Database
        orderby d.Id descending
        select d.Id
    ).FirstOrDefault() ?? 0;

    model.Id = id + 1;
    FrameworkDataStore.Database.Add(model);

    return model;
});
// update framework
app.MapPut("/framework/{id}", (int id, [FromBody] Framework model) =>
{
    Framework? framework = FrameworkDataStore.Database.FirstOrDefault(f => f.Id == id);
    if (framework != null)
    {
        framework.Name = model.Name;
    }
    return framework;
});
// delete framework
app.MapDelete("/framework/{id}", (int id) =>
{
    Framework? framework = FrameworkDataStore.Database.FirstOrDefault(f => f.Id == id);
    if (framework != null)
    {
        FrameworkDataStore.Database.Remove(framework);
    }
});

// get all votes
app.MapGet("/vote", () => FrameworkDataStore.Database);
// add 1 vote
app.MapPost("/vote/{id}", (int id) =>
{
    Framework? framework = FrameworkDataStore.Database.FirstOrDefault(f => f.Id == id);
    if (framework != null)
    {
        framework.Votes++;
    }
    return framework;
});
// remove 1 vote
app.MapDelete("/vote/{id}", (int id) =>
{
    Framework? framework = FrameworkDataStore.Database.FirstOrDefault(f => f.Id == id);
    if (framework != null)
    {
        framework.Votes--;
    }
    return framework;
});


app.Run();
