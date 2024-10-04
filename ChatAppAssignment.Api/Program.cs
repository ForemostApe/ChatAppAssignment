using ChatAppAssignment.Api.Contexts;
using ChatAppAssignment.Api.Entities;
using ChatAppAssignment.Api.Hubs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Adds SignalR to DI-container.
builder.Services.AddSignalR();

//Implements use of UserSecrets to store connection-string etc.
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

builder.Services.AddDbContext<ChatContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DbConnection")));

//Adds Identity as a service with options to setup requirements for account-registration and to create db based on ChatContext.
builder.Services.AddDefaultIdentity<UserEntity>(x =>
{
    x.User.RequireUniqueEmail = true;
    x.SignIn.RequireConfirmedEmail = false;
    x.Password.RequiredLength = 8;

}).AddEntityFrameworkStores<ChatContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//Defines URI of chat.
app.MapHub<ChatHub>("/chat");

app.Run();
